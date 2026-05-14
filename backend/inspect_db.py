from sqlmodel import Session, create_engine, select
from models import SimulationResult, User, UserStats
import os

DB_DIR = os.path.dirname(os.path.abspath(__file__))
sqlite_file_name = os.path.join(DB_DIR, "database.db")
sqlite_url = f"sqlite:///{sqlite_file_name}"
engine = create_engine(sqlite_url)

def inspect_db():
    with Session(engine) as session:
        sims = session.exec(select(SimulationResult)).all()
        print(f"Total Simulations: {len(sims)}")
        for sim in sims:
            print(f"Sim: {sim.id}, User: {sim.user_id}, Scenario: {sim.scenario_name}")
        
        users = session.exec(select(User)).all()
        print(f"Total Users: {len(users)}")

if __name__ == "__main__":
    inspect_db()
