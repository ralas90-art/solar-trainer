import requests
import json

BASE_URL = "http://localhost:8000"

def test_usage_summary():
    print("Testing Usage Summary Endpoint...")
    
    # 1. Login as Admin
    login_resp = requests.post(f"{BASE_URL}/api/v1/auth/login", data={"username": "admin@septivolt.com", "password": "admin-password"})
    if login_resp.status_code != 200:
        print(f"Login failed: {login_resp.text}")
        return
    
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Fetch Summary
    summary_resp = requests.get(f"{BASE_URL}/api/v1/company/ai-usage/summary", headers=headers)
    
    if summary_resp.status_code == 200:
        data = summary_resp.json()
        print(json.dumps(data, indent=2))
        print("\n✅ Analytics summary verified!")
    else:
        print(f"❌ Failed to fetch summary: {summary_resp.status_code}")
        print(summary_resp.text)

if __name__ == "__main__":
    test_usage_summary()
