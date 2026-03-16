from sqlmodel import Session, select
from database import engine, create_db_and_tables
from models.kpi import KPITemplate, TemplateKPI

def seed_templates():
    create_db_and_tables()
    with Session(engine) as session:
        # Check if templates exist
        existing = session.exec(select(KPITemplate)).first()
        if existing:
            print("Templates already exist. Skipping.")
            return

        print("Seeding KPI Templates...")

        # 1. Door-to-Door
        d2d = KPITemplate(name="Door-to-Door", description="Perfect for field sales reps", is_default=True)
        session.add(d2d)
        session.commit()
        session.refresh(d2d)

        d2d_kpis = [
            TemplateKPI(template_id=d2d.id, label="Knocks", target_value=100, display_order=1),
            TemplateKPI(template_id=d2d.id, label="Conversations", target_value=50, display_order=2),
            TemplateKPI(template_id=d2d.id, label="Appointments Set", target_value=15, display_order=3),
            TemplateKPI(template_id=d2d.id, label="Closes", target_value=5, display_order=4),
        ]
        for k in d2d_kpis:
            session.add(k)

        # 2. Virtual Sales
        virtual = KPITemplate(name="Virtual Sales", description="For remote sales teams", is_default=True)
        session.add(virtual)
        session.commit()
        session.refresh(virtual)

        virtual_kpis = [
            TemplateKPI(template_id=virtual.id, label="Calls Made", target_value=80, display_order=1),
            TemplateKPI(template_id=virtual.id, label="Connects", target_value=40, display_order=2),
            TemplateKPI(template_id=virtual.id, label="Appointments Booked", target_value=12, display_order=3),
            TemplateKPI(template_id=virtual.id, label="Deals Closed", target_value=4, display_order=4),
        ]
        for k in virtual_kpis:
            session.add(k)

        # 3. Hybrid
        hybrid = KPITemplate(name="Hybrid", description="Mix of D2D and virtual", is_default=True)
        session.add(hybrid)
        session.commit()
        session.refresh(hybrid)

        hybrid_kpis = [
            TemplateKPI(template_id=hybrid.id, label="Knocks", target_value=60, display_order=1),
            TemplateKPI(template_id=hybrid.id, label="Calls Made", target_value=40, display_order=2),
            TemplateKPI(template_id=hybrid.id, label="Total Conversations", target_value=60, display_order=3),
            TemplateKPI(template_id=hybrid.id, label="Appointments", target_value=15, display_order=4),
            TemplateKPI(template_id=hybrid.id, label="Closes", target_value=5, display_order=5),
        ]
        for k in hybrid_kpis:
            session.add(k)

        session.commit()
        print("Templates seeded successfully!")

if __name__ == "__main__":
    seed_templates()
