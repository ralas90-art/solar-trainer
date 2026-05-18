import os
import sys
import unittest
from datetime import date, datetime, timedelta
from typing import Generator
import json
from uuid import UUID

from fastapi.testclient import TestClient
from sqlmodel import SQLModel, create_engine, Session

# Add current directory to path to ensure backend imports work
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from main import app
from database import get_session
from models.user import UserStats, Company, User, UserRole, PlanTier
from models.kpi import KPIDefinition, KPIEntry
from routers.analytics_snapshot import ANALYTICS_CACHE

from sqlalchemy.pool import StaticPool

# Create a clean sqlite in-memory database for testing
test_engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)

def override_get_session() -> Generator[Session, None, None]:
    with Session(test_engine) as session:
        yield session

# Override the database session dependency
app.dependency_overrides[get_session] = override_get_session

class TestDashboardKPIIntegration(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Create all tables in the test database once
        SQLModel.metadata.create_all(test_engine)
        
        # Seed required static company and admin user details in test db
        with Session(test_engine) as session:
            septivolt = Company(id="septivolt", name="Septivolt Solar", plan_tier=PlanTier.GROWTH)
            session.add(septivolt)
            
            demo_company = Company(id="sales_accelerator_demo", name="Sales Accelerator Demo", plan_tier=PlanTier.ENTERPRISE, payment_status="active")
            session.add(demo_company)
            
            admin_user = User(
                username="admin",
                email="admin@septivolt.com",
                password="adminpassword123",
                role=UserRole.ADMIN,
                company_id="sales_accelerator_demo"
            )
            session.add(admin_user)
            session.commit()

    def setUp(self):
        # Make sure database tables are clean and regenerated for each test
        SQLModel.metadata.drop_all(test_engine)
        SQLModel.metadata.create_all(test_engine)
        
        # Ensure company and user exist for session context
        with Session(test_engine) as session:
            septivolt = Company(id="septivolt", name="Septivolt Solar", plan_tier=PlanTier.GROWTH)
            session.add(septivolt)
            
            # Seed our test users
            user1 = User(id=1, username="test_rep_1", email="rep1@septivolt.com", password="password123", role=UserRole.SALES_REP, company_id="septivolt")
            session.add(user1)
            session.commit()
            
        # Clear in-process cache to ensure fresh calculations
        ANALYTICS_CACHE.clear()
        self.client = TestClient(app)

    def tearDown(self):
        pass

    def test_scenario_1_completely_new_user(self):
        """
        Scenario 1: Completely new user (no KPI definitions, no entries, no simulation history) -> Empty state / base defaults.
        """
        # Ensure no records exist in UserStats for test_rep_1
        # Query snap route for new user with DEMO_MODE off to prevent injecting realistic simulator history
        os.environ["DEMO_MODE"] = "false"
        response = self.client.get("/api/v1/analytics/snapshot?user_id=test_rep_1&time_range=weekly")
        self.assertEqual(response.status_code, 200)
        
        data = response.json()
        self.assertEqual(data["overallPerformanceScore"], 0)
        self.assertEqual(data["simulationsCompleted"], 0)
        self.assertEqual(data["averageSimulationScore"], 0)
        self.assertEqual(data["currentTrainingStreak"], 0)
        self.assertEqual(data["fieldGoalAchievement"], 0.0)
        self.assertEqual(len(data["simulationHistory"]), 0)
        self.assertEqual(len(data["kpis"]), 0)
        
        # New users without goals should see Setup goals warning/recommendation
        insights = [i["title"] for i in data["coachingInsights"]]
        self.assertIn("Setup Sales Goals", insights)

    def test_scenario_2_kpi_definitions_no_entries(self):
        """
        Scenario 2: KPI definitions present but NO entries logged -> 0% achievement, prompt logged.
        """
        os.environ["DEMO_MODE"] = "false"
        with Session(test_engine) as session:
            # Seed a user stat
            session.add(UserStats(user_id="test_rep_1", total_score=0, current_streak=0, lives=3))
            
            # Seed a custom KPI definition
            kpi_def = KPIDefinition(
                user_id="test_rep_1",
                label="Knocks",
                description="Door knocks",
                target_value=20,
                target_weekly=100,
                display_order=1
            )
            session.add(kpi_def)
            session.commit()

        response = self.client.get("/api/v1/analytics/snapshot?user_id=test_rep_1&time_range=weekly")
        self.assertEqual(response.status_code, 200)
        
        data = response.json()
        self.assertEqual(data["overallPerformanceScore"], 0)
        self.assertEqual(data["fieldGoalAchievement"], 0.0)
        self.assertEqual(len(data["kpis"]), 1)
        self.assertEqual(data["kpis"][0]["label"], "Knocks")
        self.assertEqual(data["kpis"][0]["total"], 0)
        self.assertEqual(data["kpis"][0]["achievement"], 0.0)
        
        # User has definitions but no entries -> should be prompted to log their first day
        insights = [i["title"] for i in data["coachingInsights"]]
        self.assertIn("Log Your First Day", insights)

    def test_scenario_3_entries_no_custom_period_targets(self):
        """
        Scenario 3: Entries present but NO custom period targets -> Defaults to daily target fallback multipliers.
        """
        os.environ["DEMO_MODE"] = "false"
        with Session(test_engine) as session:
            session.add(UserStats(user_id="test_rep_1", total_score=0, current_streak=0, lives=3))
            
            # Seed KPI definition with daily target but NO weekly/monthly targets
            kpi_def = KPIDefinition(
                user_id="test_rep_1",
                label="Knocks",
                target_value=10, # Daily target
                target_weekly=None, # No custom weekly target
                target_monthly=None,
                display_order=1
            )
            session.add(kpi_def)
            session.commit()
            session.refresh(kpi_def)
            
            # Seed an entry for today
            entry = KPIEntry(
                user_id="test_rep_1",
                kpi_definition_id=kpi_def.id,
                date=date.today(),
                value=25 # Logged 25 knocks
            )
            session.add(entry)
            session.commit()

        # Query weekly snap (period target should fall back to daily target * 5)
        response = self.client.get("/api/v1/analytics/snapshot?user_id=test_rep_1&time_range=weekly")
        self.assertEqual(response.status_code, 200)
        
        data = response.json()
        self.assertEqual(len(data["kpis"]), 1)
        kpi_res = data["kpis"][0]
        
        # Weekly target should be 10 * 5 = 50
        self.assertEqual(kpi_res["target"], 50)
        # Total logged is 25, so achievement is (25 / 50) * 100 = 50.0%
        self.assertEqual(kpi_res["achievement"], 50.0)

    def test_scenario_4_simulation_data_only(self):
        """
        Scenario 4: Simulation data only -> Blended overall score matches simulation averages.
        """
        os.environ["DEMO_MODE"] = "false"
        with Session(test_engine) as session:
            # Seed stats with only scenario progress (Simulations completed)
            stats = UserStats(
                user_id="test_rep_1",
                total_score=200,
                current_streak=3,
                scenario_progress=json.dumps({
                    "sim_1": {"passed": True, "best_score": 80, "attempts": 1},
                    "sim_2": {"passed": True, "best_score": 90, "attempts": 2}
                })
            )
            session.add(stats)
            session.commit()

        response = self.client.get("/api/v1/analytics/snapshot?user_id=test_rep_1&time_range=weekly")
        self.assertEqual(response.status_code, 200)
        
        data = response.json()
        self.assertEqual(data["simulationsCompleted"], 2)
        # Average simulation score is (80 + 90) / 2 = 85
        self.assertEqual(data["averageSimulationScore"], 85)
        # Blended score should match simulator average since no KPIs are active
        self.assertEqual(data["overallPerformanceScore"], 85)
        self.assertEqual(data["fieldGoalAchievement"], 0.0)

    def test_scenario_5_kpi_field_data_only(self):
        """
        Scenario 5: KPI field data only -> Blended overall score matches field averages.
        """
        os.environ["DEMO_MODE"] = "false"
        with Session(test_engine) as session:
            session.add(UserStats(user_id="test_rep_1", total_score=0, current_streak=0, lives=3))
            
            kpi_def = KPIDefinition(
                user_id="test_rep_1",
                label="Closes",
                target_value=2,
                target_weekly=10,
                display_order=1
            )
            session.add(kpi_def)
            session.commit()
            session.refresh(kpi_def)
            
            entry = KPIEntry(
                user_id="test_rep_1",
                kpi_definition_id=kpi_def.id,
                date=date.today(),
                value=8
            )
            session.add(entry)
            session.commit()

        response = self.client.get("/api/v1/analytics/snapshot?user_id=test_rep_1&time_range=weekly")
        self.assertEqual(response.status_code, 200)
        
        data = response.json()
        self.assertEqual(data["simulationsCompleted"], 0)
        # Field achievement is (8 / 10) * 100 = 80%
        self.assertEqual(data["fieldGoalAchievement"], 80.0)
        # Blended score should match field achievement since no simulations are active
        self.assertEqual(data["overallPerformanceScore"], 80)

    def test_scenario_6_both_simulation_and_kpi_data(self):
        """
        Scenario 6: BOTH simulation and KPI data -> Weighted 50/50 blended overall score.
        """
        os.environ["DEMO_MODE"] = "false"
        with Session(test_engine) as session:
            # Seed simulation data (average score 90)
            stats = UserStats(
                user_id="test_rep_1",
                total_score=200,
                current_streak=3,
                scenario_progress=json.dumps({
                    "sim_1": {"passed": True, "best_score": 90, "attempts": 1}
                })
            )
            session.add(stats)
            
            # Seed KPI data (field goal achievement 80%)
            kpi_def = KPIDefinition(
                user_id="test_rep_1",
                label="Closes",
                target_value=2,
                target_weekly=10,
                display_order=1
            )
            session.add(kpi_def)
            session.commit()
            session.refresh(kpi_def)
            
            entry = KPIEntry(
                user_id="test_rep_1",
                kpi_definition_id=kpi_def.id,
                date=date.today(),
                value=8
            )
            session.add(entry)
            session.commit()

        response = self.client.get("/api/v1/analytics/snapshot?user_id=test_rep_1&time_range=weekly")
        self.assertEqual(response.status_code, 200)
        
        data = response.json()
        self.assertEqual(data["averageSimulationScore"], 90)
        self.assertEqual(data["fieldGoalAchievement"], 80.0)
        # Blended score should be 50% sim (90) + 50% field (80) = 85
        self.assertEqual(data["overallPerformanceScore"], 85)

    def test_scenario_7_stale_field_activity_warning(self):
        """
        Scenario 7: Stale field activity warning (no logged entries in the last 72 hours).
        """
        os.environ["DEMO_MODE"] = "false"
        with Session(test_engine) as session:
            session.add(UserStats(user_id="test_rep_1", total_score=0, current_streak=0, lives=3))
            
            kpi_def = KPIDefinition(
                user_id="test_rep_1",
                label="Knocks",
                target_value=20,
                target_weekly=100,
                display_order=1
            )
            session.add(kpi_def)
            session.commit()
            session.refresh(kpi_def)
            
            # Log an entry dated 4 days ago
            entry = KPIEntry(
                user_id="test_rep_1",
                kpi_definition_id=kpi_def.id,
                date=date.today() - timedelta(days=4),
                value=15
            )
            session.add(entry)
            session.commit()

        response = self.client.get("/api/v1/analytics/snapshot?user_id=test_rep_1&time_range=weekly")
        self.assertEqual(response.status_code, 200)
        
        data = response.json()
        
        # Verify Stale Activity Warning exists
        warnings = [i for i in data["coachingInsights"] if "Stale Activity" in i["title"]]
        self.assertEqual(len(warnings), 1)
        self.assertEqual(warnings[0]["severity"], "high")

    def test_scenario_8_funnel_ratio_bottlenecks(self):
        """
        Scenario 8: Funnel ratio bottlenecks (Set-to-Conversation < 15%, etc.) triggering high-severity alerts.
        """
        os.environ["DEMO_MODE"] = "false"
        with Session(test_engine) as session:
            session.add(UserStats(user_id="test_rep_1", total_score=0, current_streak=0, lives=3))
            
            # Setup definitions for Knocks and Conversations
            knocks_def = KPIDefinition(
                user_id="test_rep_1",
                label="Knocks",
                target_value=20,
                target_weekly=100,
                display_order=1
            )
            conv_def = KPIDefinition(
                user_id="test_rep_1",
                label="Conversations",
                target_value=10,
                target_weekly=50,
                display_order=2
            )
            session.add(knocks_def)
            session.add(conv_def)
            session.commit()
            session.refresh(knocks_def)
            session.refresh(conv_def)
            
            # Log entries: Knocks = 100, Conversations = 10
            # Knock-to-Conversation ratio = 10 / 100 = 10% (benchmark >= 15%)
            entry_knocks = KPIEntry(
                user_id="test_rep_1",
                kpi_definition_id=knocks_def.id,
                date=date.today(),
                value=100
            )
            entry_conv = KPIEntry(
                user_id="test_rep_1",
                kpi_definition_id=conv_def.id,
                date=date.today(),
                value=10
            )
            session.add(entry_knocks)
            session.add(entry_conv)
            session.commit()

        response = self.client.get("/api/v1/analytics/snapshot?user_id=test_rep_1&time_range=weekly")
        self.assertEqual(response.status_code, 200)
        
        data = response.json()
        
        # Verify Knock-to-Conversation Bottleneck exists
        bottlenecks = [i for i in data["coachingInsights"] if "Knock-to-Conversation" in i["title"]]
        self.assertEqual(len(bottlenecks), 1)
        self.assertEqual(bottlenecks[0]["severity"], "high")

if __name__ == "__main__":
    unittest.main()
