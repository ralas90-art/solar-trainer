import requests
import time
import json
import uuid

BASE_URL = "http://localhost:8000"

def verify_phase_7b():
    print("\n--- Starting Phase 7B Verification (Coaching Drill-Down) ---")

    # 1. Setup Test Data
    # Company A
    comp_a = f"compa_{int(time.time())}"
    print(f"Setting up {comp_a}...")
    
    # Manager A
    mgr_a_res = requests.post(f"{BASE_URL}/signup", json={
        "email": f"mgr_{comp_a}@test.com",
        "password": "password123",
        "full_name": "Manager A",
        "company_id": comp_a,
        "role": "manager"
    }).json()
    mgr_a_token = requests.post(f"{BASE_URL}/login", json={
        "email": f"mgr_{comp_a}@test.com",
        "password": "password123"
    }).json()["access_token"]

    # Rep A
    rep_a_res = requests.post(f"{BASE_URL}/signup", json={
        "email": f"rep_{comp_a}@test.com",
        "password": "password123",
        "full_name": "Rep A",
        "company_id": comp_a,
        "role": "sales_rep"
    }).json()
    rep_a_login = requests.post(f"{BASE_URL}/login", json={
        "email": f"rep_{comp_a}@test.com",
        "password": "password123"
    }).json()
    rep_a_id = rep_a_login["user"]["id"]
    rep_a_token = rep_a_login["access_token"]

    # Company B
    comp_b = f"compb_{int(time.time())}"
    print(f"Setting up {comp_b}...")
    
    # Manager B
    mgr_b_res = requests.post(f"{BASE_URL}/signup", json={
        "email": f"mgr_{comp_b}@test.com",
        "password": "password123",
        "full_name": "Manager B",
        "company_id": comp_b,
        "role": "manager"
    }).json()
    mgr_b_token = requests.post(f"{BASE_URL}/login", json={
        "email": f"mgr_{comp_b}@test.com",
        "password": "password123"
    }).json()["access_token"]

    # Rep B
    rep_b_res = requests.post(f"{BASE_URL}/signup", json={
        "email": f"rep_{comp_b}@test.com",
        "password": "password123",
        "full_name": "Rep B",
        "company_id": comp_b,
        "role": "sales_rep"
    }).json()
    rep_b_id = requests.post(f"{BASE_URL}/login", json={
        "email": f"rep_{comp_b}@test.com",
        "password": "password123"
    }).json()["user"]["id"]

    # 2. Add some simulation history for Rep A
    print("Creating simulation history for Rep A...")
    requests.post(f"{BASE_URL}/chat", headers={"Authorization": f"Bearer {rep_a_token}"}, json={
        "user_id": rep_a_id,
        "tenant_id": comp_a,
        "state_code": "CA",
        "scenario_id": "d2d_1",
        "user_message": "Hi, I noticed you have a great roof for solar."
    })

    # 3. Test Access Controls
    print("\n--- Testing Access Controls ---")
    
    # Manager A viewing Rep A (Success)
    res = requests.get(f"{BASE_URL}/api/v1/reps/{rep_a_id}/coaching-profile", headers={"Authorization": f"Bearer {mgr_a_token}"})
    if res.status_code == 200:
        print("[SUCCESS] Manager A successfully viewed Rep A profile")
        data = res.json()
        if len(data["simulation_history"]) > 0:
            print(f"[SUCCESS] Found {len(data['simulation_history'])} simulation records")
        else:
            print("[FAILURE] Simulation history missing")
    else:
        print(f"[FAILURE] Manager A could not view Rep A profile (Status: {res.status_code})")

    # Manager A viewing Rep B (Failure - Isolation)
    res = requests.get(f"{BASE_URL}/api/v1/reps/{rep_b_id}/coaching-profile", headers={"Authorization": f"Bearer {mgr_a_token}"})
    if res.status_code == 403:
        print("[SUCCESS] Isolation Verified: Manager A blocked from viewing Rep B")
    else:
        print(f"[FAILURE] Isolation Breach! Manager A viewed Rep B profile (Status: {res.status_code})")

    # Rep A viewing Rep B (Failure - RBAC)
    res = requests.get(f"{BASE_URL}/api/v1/reps/{rep_b_id}/coaching-profile", headers={"Authorization": f"Bearer {rep_a_token}"})
    if res.status_code == 403:
        print("[SUCCESS] RBAC Verified: Rep A blocked from viewing Rep B")
    else:
        print(f"[FAILURE] RBAC Breach! Rep A viewed Rep B profile (Status: {res.status_code})")

    # 4. Test Coaching Notes
    print("\n--- Testing Coaching Notes ---")
    
    # Manager A adding note to Rep A
    res = requests.post(f"{BASE_URL}/api/v1/reps/{rep_a_id}/coaching-notes", headers={"Authorization": f"Bearer {mgr_a_token}"}, json={
        "content": "Great first attempt. Focus on active listening next time."
    })
    if res.status_code == 200:
        print("[SUCCESS] Manager A successfully added a coaching note")
    else:
        print(f"[FAILURE] Could not add coaching note (Status: {res.status_code})")

    # Verify note in profile
    res = requests.get(f"{BASE_URL}/api/v1/reps/{rep_a_id}/coaching-profile", headers={"Authorization": f"Bearer {mgr_a_token}"})
    data = res.json()
    if any(n["content"] == "Great first attempt. Focus on active listening next time." for n in data["coaching_notes"]):
        print("[SUCCESS] Coaching note successfully persisted and retrieved")
    else:
        print("[FAILURE] Coaching note not found in profile")

    print("\n--- Phase 7B Verification Complete ---")

if __name__ == "__main__":
    verify_phase_7b()
