import requests
import json
import uuid

BASE_URL = "http://localhost:8000"

def setup_test_data():
    """Seeds two companies with 3 reps each for isolation testing."""
    companies = ["comp_a", "comp_b"]
    tokens = {}

    for comp_id in companies:
        print(f"\n--- Setting up {comp_id} ---")
        # 1. Signup Manager
        manager_email = f"manager_{comp_id}@test.com"
        requests.post(f"{BASE_URL}/signup", json={
            "email": manager_email,
            "password": "password123",
            "full_name": f"Manager {comp_id}",
            "company_id": comp_id,
            "role": "manager"
        })

        # 2. Login
        login_res = requests.post(f"{BASE_URL}/login", json={
            "email": manager_email,
            "password": "password123"
        }).json()
        token = login_res["access_token"]
        tokens[comp_id] = token

        # 3. Create 3 Reps and some progress
        for i in range(1, 4):
            rep_email = f"rep_{i}_{comp_id}@test.com"
            signup_res = requests.post(f"{BASE_URL}/signup", json={
                "email": rep_email,
                "password": "password123",
                "full_name": f"Rep {i} {comp_id}",
                "company_id": comp_id,
                "role": "sales_rep"
            }).json()
            
            # Login as rep to update progress
            rep_login = requests.post(f"{BASE_URL}/login", json={
                "email": rep_email,
                "password": "password123"
            }).json()
            rep_token = rep_login["access_token"]
            rep_id = rep_login["user"]["id"]

            # Add some score
            requests.post(f"{BASE_URL}/user/{rep_id}/progress", 
                headers={"Authorization": f"Bearer {rep_token}"},
                json={
                    "module_id": "test_mod",
                    "type": "sim",
                    "passed": True,
                    "score": 100 * i,
                    "xp": 100 * i
                }
            )
            print(f"Created Rep {i} for {comp_id} with score {100 * i}")

    return tokens

def verify_isolation(tokens):
    print("\n--- Verifying Isolation ---")
    
    # 1. Check Comp A leaderboard
    res_a = requests.get(f"{BASE_URL}/api/v1/leaderboard", 
                         headers={"Authorization": f"Bearer {tokens['comp_a']}"})
    leaderboard_a = res_a.json()
    print(f"Company A Leaderboard Size: {len(leaderboard_a)}")
    
    for entry in leaderboard_a:
        if "comp_b" in entry["name"]:
            print(f"❌ FAILURE: Found Company B user in Company A leaderboard: {entry['name']}")
            return False
    
    print("✅ Company A isolation verified.")

    # 2. Check Comp B leaderboard
    res_b = requests.get(f"{BASE_URL}/api/v1/leaderboard", 
                         headers={"Authorization": f"Bearer {tokens['comp_b']}"})
    leaderboard_b = res_b.json()
    print(f"Company B Leaderboard Size: {len(leaderboard_b)}")

    for entry in leaderboard_b:
        if "comp_a" in entry["name"]:
            print(f"❌ FAILURE: Found Company A user in Company B leaderboard: {entry['name']}")
            return False

    print("✅ Company B isolation verified.")
    
    # 3. Check Ranking Logic (Desc score)
    scores = [e["total_score"] for e in leaderboard_a]
    if scores != sorted(scores, reverse=True):
        print(f"❌ FAILURE: Leaderboard not sorted by score: {scores}")
        return False
    
    print("✅ Ranking logic (descending score) verified.")
    return True

if __name__ == "__main__":
    try:
        tokens = setup_test_data()
        if verify_isolation(tokens):
            print("\n🎉 PHASE 7 VERIFICATION SUCCESSFUL")
        else:
            print("\n❌ PHASE 7 VERIFICATION FAILED")
    except Exception as e:
        print(f"Error during verification: {e}")
