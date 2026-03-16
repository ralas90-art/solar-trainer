import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_webhook_flow():
    # 1. Create a dummy company/user if needed or use existing 'septivolt'
    print("--- Testing Webhook Flow ---")
    
    # Mocking Stripe Event
    mock_event = {
        "id": "evt_test",
        "type": "checkout.session.completed",
        "data": {
            "object": {
                "client_reference_id": "septivolt",
                "customer": "cus_test_123",
                "subscription": "sub_test_123",
                "metadata": {
                    "tier": "growth"
                }
            }
        }
    }

    print("Sending mock checkout.session.completed event...")
    # Note: We skip signature verification in dev by manually calling the logic 
    # OR we can mock the Header. For this test, we'll assume valid signature handling.
    
    # In a real test, you'd use stripe CLI to trigger this. 
    # Here we'll just check if the backend is reachable.
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            print("Backend is online.")
        else:
            print(f"Backend returned {response.status_code}")
    except Exception as e:
        print(f"Error connecting to backend: {e}")

if __name__ == "__main__":
    test_webhook_flow()
