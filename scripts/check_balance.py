import os
import requests
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("ELEVENLABS_API_KEY")
url = "https://api.elevenlabs.io/v1/user/subscription"
headers = {"xi-api-key": api_key}

response = requests.get(url, headers=headers)
if response.status_code == 200:
    data = response.json()
    char_count = data.get("character_count", 0)
    char_limit = data.get("character_limit", 0)
    remaining = char_limit - char_count
    print(f"ElevenLabs Character Balance:")
    print(f"  Used: {char_count:,}")
    print(f"  Limit: {char_limit:,}")
    print(f"  Remaining: {remaining:,}")
else:
    print(f"Error fetching balance: {response.text}")
