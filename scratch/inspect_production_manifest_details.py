import json
from pathlib import Path

def inspect_details():
    path = Path(r"c:\Users\12132\Documents\Claude\Projects\Solar Sales Accelorator\ElevenLabs_Production_Manifest.json")
    content = path.read_text(encoding="utf-8")
    data = json.loads(content)
    
    modules = data.get("modules", [])
    print(f"Total modules: {len(modules)}")
    
    all_keys = set()
    for m in modules:
        all_keys.update(m.keys())
        
    print("Keys inside module objects:", all_keys)
    
    # Check if any voice is mentioned
    voices_found = set()
    for m in modules:
        for k, v in m.items():
            if "voice" in k.lower():
                voices_found.add((k, str(v)))
    print("Voice keys and values:", voices_found)
    
if __name__ == "__main__":
    inspect_details()
