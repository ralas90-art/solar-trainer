import json
from pathlib import Path

def inspect_modules_en():
    base = Path("scripts")
    p = base / "modules_en.json"
    if p.exists():
        try:
            content = p.read_text(encoding="utf-16")
        except Exception:
            content = p.read_text(encoding="utf-8", errors="ignore")
            
        data = json.loads(content)
        print("Type of data in modules_en.json:", type(data))
        if isinstance(data, list):
            print("Length:", len(data))
            print("First item keys:", list(data[0].keys()) if len(data) > 0 else [])
            if len(data) > 0:
                print(json.dumps(data[0], indent=2)[:1000])
        elif isinstance(data, dict):
            print("Keys:", list(data.keys())[:5])
            if len(data) > 0:
                first_k = list(data.keys())[0]
                print(f"First key '{first_k}' keys:", list(data[first_k].keys()) if isinstance(data[first_k], dict) else [])
                print(json.dumps(data[first_k], indent=2)[:1000])

if __name__ == "__main__":
    inspect_modules_en()
