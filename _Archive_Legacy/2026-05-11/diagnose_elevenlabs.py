"""
ElevenLabs API Key Diagnostic Script
Tries both raw requests and the official SDK to identify the auth issue.
"""
import os
import sys
import requests

KEY = os.environ.get("ELEVENLABS_API_KEY", "")

print("=" * 50)
print("ElevenLabs API Key Diagnostic")
print("=" * 50)
print(f"Key length      : {len(KEY)} characters")
print(f"Key prefix      : {KEY[:8]}...")
print(f"Key suffix      : ...{KEY[-6:]}")
print(f"Starts with sk_ : {KEY.startswith('sk_')}")

print("\n--- Testing /v1/user ---")
r = requests.get(
    "https://api.elevenlabs.io/v1/user",
    headers={"xi-api-key": KEY}
)
print(f"Status: {r.status_code}")
print(f"Body  : {r.text[:300]}")

print("\n--- Testing /v1/voices ---")
r2 = requests.get(
    "https://api.elevenlabs.io/v1/voices",
    headers={"xi-api-key": KEY}
)
print(f"Status: {r2.status_code}")
print(f"Body  : {r2.text[:300]}")

print("\n--- Testing SDK ---")
try:
    from elevenlabs.client import ElevenLabs
    client = ElevenLabs(api_key=KEY)
    user = client.user.get()
    print(f"SDK Auth OK — Tier: {user.subscription.tier}")
    print(f"Chars used : {user.subscription.character_count}")
    print(f"Chars limit: {user.subscription.character_limit}")
except Exception as e:
    print(f"SDK Error: {e}")
