import requests
import os
from dotenv import load_dotenv

load_dotenv()

def check_balance():
    api_key = os.getenv("ELEVENLABS_API_KEY")
    url = "https://api.elevenlabs.io/v1/user/subscription"
    headers = {"xi-api-key": api_key}
    
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        remaining = data["character_limit"] - data["character_count"]
        print(f"Character Limit: {data['character_limit']}")
        print(f"Character Count: {data['character_count']}")
        print(f"Remaining: {remaining}")
    else:
        print(f"Error: {response.status_code}")
        print(response.text)

if __name__ == "__main__":
    check_balance()
