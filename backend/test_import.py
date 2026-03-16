try:
    from models import TenantConfig
    print("Successfully imported TenantConfig")
except ImportError as e:
    print(f"ImportError: {e}")
except Exception as e:
    print(f"Other Error: {e}")
