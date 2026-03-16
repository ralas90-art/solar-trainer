from dotenv import load_dotenv
load_dotenv()
from sqlmodel import Session, select, delete
from database import engine, create_db_and_tables
from models.kpi import KPIDefinition

def fix_duplicates():
    print(f"DB URL: {engine.url}")
    create_db_and_tables()
    with Session(engine) as session:
        print("Checking for duplicate KPIs...")
        
        # Get all KPIs
        kpis = session.exec(select(KPIDefinition).order_by(KPIDefinition.user_id, KPIDefinition.display_order)).all()
        print(f"Total KPIs in DB: {len(kpis)}")

        # Group by user
        by_user = {}
        for k in kpis:
            if k.user_id not in by_user:
                by_user[k.user_id] = []
            by_user[k.user_id].append(k)

        duplicates = []
        for uid, user_kpis in by_user.items():
            print(f"User {uid} has {len(user_kpis)} KPIs")
            seen_labels = {} 
            for k in user_kpis:
                print(f"  - {k.label} (ID: {k.id})")
                lbl = k.label.strip().lower()
                if lbl in seen_labels:
                    duplicates.append(k)
                    print(f"    -> DUPLICATE FOUND: {k.label}")
                else:
                    seen_labels[lbl] = k

        print(f"Found {len(duplicates)} duplicates.")
        
        for dup in duplicates:
            print(f"Deleting duplicate: {dup.label} (ID: {dup.id})")
            session.delete(dup)
            
        session.commit()
        print("Duplicates removed!")

if __name__ == "__main__":
    fix_duplicates()
