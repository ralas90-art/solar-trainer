from sqlmodel import Session, select
from database import engine
from models.kpi import KPITemplate, TemplateKPI, KPIDefinition, KPIEntry

def dump():
    with Session(engine) as session:
        print("--- TEMPLATES ---")
        templates = session.exec(select(KPITemplate)).all()
        for t in templates:
            print(f"Template: {t.id} - {t.name} - {t.description}")
            
        print("\n--- TEMPLATE KPIs ---")
        tkpis = session.exec(select(TemplateKPI)).all()
        for tk in tkpis:
            print(f"TemplateKPI: {tk.id} - {tk.label} - target={tk.target_value} - template={tk.template_id}")
            
        print("\n--- KPI DEFINITIONS ---")
        defs = session.exec(select(KPIDefinition)).all()
        for d in defs:
            print(f"KPIDef: {d.id} - {d.label} - daily={d.target_value} - weekly={d.target_weekly} - monthly={d.target_monthly} - quarterly={d.target_quarterly} - user={d.user_id}")
            
        print("\n--- KPI ENTRIES ---")
        entries = session.exec(select(KPIEntry)).all()
        for e in entries:
            print(f"Entry: {e.id} - kpi={e.kpi_definition_id} - date={e.date} - val={e.value} - user={e.user_id}")

if __name__ == "__main__":
    dump()
