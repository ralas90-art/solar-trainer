import json
from pathlib import Path

def search_logs():
    log_file = Path(r"C:\Users\12132\.gemini\antigravity\brain\f4ad80f6-bdc2-4c70-94a8-0831a249de83\.system_generated\logs\transcript.jsonl")
    if not log_file.exists():
        print("Log file does not exist.")
        return

    print("Searching for build_es_modules.ts in transcript...")
    with open(log_file, "r", encoding="utf-8") as f:
        for line in f:
            if "build_es_modules.ts" in line:
                item = json.loads(line)
                tool_calls = item.get("tool_calls", [])
                for call in tool_calls:
                    if "write_to_file" in call.get("name", "") or "replace_file_content" in call.get("name", ""):
                        print("Found file operation call:", call)
                        return

if __name__ == "__main__":
    search_logs()

