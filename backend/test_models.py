try:
    from models.user import User
    print("Successfully imported User")
except Exception as e:
    print(f"User Error: {e}")

try:
    from models.kpi import KPIDefinition
    print("Successfully imported KPIDefinition")
except Exception as e:
    print(f"KPI Error: {e}")
