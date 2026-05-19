import json
from pathlib import Path

def inspect_json(file_path):
    print(f"=== Inspecting {file_path} ===")
    try:
        # try both utf-8 and utf-16
        for enc in ['utf-8', 'utf-16']:
            try:
                with open(file_path, 'r', encoding=enc) as f:
                    data = json.load(f)
                print(f"Successfully read with {enc}!")
                print(f"Type: {type(data)}")
                if isinstance(data, dict):
                    print(f"Keys (up to 10): {list(data.keys())[:10]}")
                    first_key = list(data.keys())[0]
                    print(f"First element structure: {type(data[first_key])}")
                    if isinstance(data[first_key], dict):
                        print(f"First element keys: {list(data[first_key].keys())}")
                elif isinstance(data, list):
                    print(f"Length: {len(data)}")
                    if data:
                        print(f"First element structure: {type(data[0])}")
                        if isinstance(data[0], dict):
                            print(f"First element keys: {list(data[0].keys())}")
                return data
            except Exception as e:
                pass
    except Exception as e:
        print(f"Error: {e}")
    return None

inspect_json('scripts/modules_en.json')
inspect_json('scripts/curriculum_map.json')
inspect_json('scripts/narration_transcripts_part1_updated.json')
inspect_json('scripts/narration_transcripts_part2_updated.json')
inspect_json('scripts/audio_inventory_map.json')
