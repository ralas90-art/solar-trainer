import requests
import json

API_URL = "http://127.0.0.1:8000"

def debug_kpi():
    # 1. Get Templates
    print(f"Fetching templates from {API_URL}...")
    try:
        res = requests.get(f"{API_URL}/api/v1/kpis/templates", timeout=5)
        print(f"Get Status: {res.status_code}")
        
        if res.status_code != 200:
            print(f"Failed to get templates: {res.text}")
            return
        
        templates = res.json()
        print(f"Found {len(templates)} templates.")
        
        if not templates:
            print("No templates found!")
            return

        template = templates[0]
        print(f"Attemping to apply template: {template['name']} ({template['id']})")

        # 2. Apply Template
        apply_url = f"{API_URL}/api/v1/kpis/templates/{template['id']}/apply"
        print(f"POST {apply_url}")
        apply_res = requests.post(apply_url, timeout=5)
        
        print(f"Apply Status: {apply_res.status_code}")
        if apply_res.status_code == 200:
            print("Template applied successfully!")
            print(apply_res.json())
        else:
            print(f"Failed to apply template: {apply_res.text}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    debug_kpi()
