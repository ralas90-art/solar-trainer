import json
from pathlib import Path

def find_fields():
    p = Path(r"c:\Users\12132\Desktop\Antigravity Solar Sales Trainer Agent\scripts\modules_en.json")
    if not p.exists():
        print("modules_en.json does not exist.")
        return
        
    for enc in ["utf-16", "utf-8", "latin-1"]:
        try:
            content = p.read_text(encoding=enc)
            break
        except Exception:
            continue
            
    data = json.loads(content)
    # Check what fields exist inside mod_1_1 or its sections
    print("Module level keys:", list(data["mod_1_1"].keys()))
    print("Section level keys:", list(data["mod_1_1"]["sections"][0].keys()))
    
    # Are there any occurrences of "voice" or "voiceName" or ElevenLabs voice IDs in this json?
    terms = ["voice", "rachel", "dom", "tom", "21m", "AZn", "QO7"]
    found = {}
    for term in terms:
        found[term] = []
        
    for mod_id, mod in data.items():
        # search keys or values
        mod_str = json.dumps(mod).lower()
        for term in terms:
            if term.lower() in mod_str:
                found[term].append(mod_id)
                
    for term, mods in found.items():
        print(f"Term '{term}' found in modules: {mods[:10]} (total {len(mods)})")

if __name__ == "__main__":
    find_fields()
