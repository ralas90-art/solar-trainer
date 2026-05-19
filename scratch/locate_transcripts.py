import json
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

# Load raw modules
with open('scripts/modules_en.json', 'r', encoding='utf-16') as f:
    modules_en = json.load(f)

# Load curriculum map (if needed, but modules_en.json is direct)
with open('scripts/audio_inventory_en_core.json', 'r', encoding='utf-8') as f:
    audio_inventory = json.load(f)

day1_mods = ['mod_1_1', 'mod_1_2', 'mod_1_3', 'mod_1_4', 'mod_1_5', 'mod_1_6', 'mod_1_7', 'mod_1_8']

def clean_text(value: str) -> str:
    return " ".join(value.split())

def extract_lesson_overview(module):
    # find first text or quote section
    for sec in module.get('sections', []):
        if sec.get('type') in ['text', 'quote'] and sec.get('content'):
            return clean_text(sec.get('content'))[:360]
    # find list section
    for sec in module.get('sections', []):
        if sec.get('type') == 'list' and sec.get('content'):
            return clean_text(sec.get('content'))
    return "Complete this module to build confidence for high-pressure homeowner conversations."

# Replicate buildModuleAudioLesson in Python
for mid in day1_mods:
    module = modules_en.get(mid)
    if not module:
        print(f"ERROR: {mid} not found in modules_en.json")
        continue
    
    print(f"\n=================== MODULE {mid}: {module.get('title')} ===================")
    
    # We want to match this module's segments in buildModuleAudioLesson
    lesson_title = module.get('title', '')
    lesson_overview = extract_lesson_overview(module)
    
    # Transition scenario
    # In JS: const transitionScenario = module.simulationScenarioIds[0] ?? "assigned scenario"
    # But in raw modules_en, do we have simulationScenarioIds?
    # Let's search raw sections for type == simulation
    sim_scenarios = []
    for sec in module.get('sections', []):
        if sec.get('type') == 'simulation':
            sim_scenarios.append(sec.get('title', ''))
    transition_scenario = sim_scenarios[0] if sim_scenarios else "assigned scenario"
    
    # We need to know if the first segment script is redundant
    non_sim_sections = [s for s in module.get('sections', []) if s.get('type') != 'simulation']
    
    first_seg_text = clean_text(non_sim_sections[0].get('content', '')) if non_sim_sections else ""
    is_intro_redundant = first_seg_text.lower().startswith(lesson_overview.lower()[:50])
    
    intro_text = f"Welcome to {lesson_title}. Let's get started." if is_intro_redundant else f"Welcome to {lesson_title}. {lesson_overview}"
    
    # Create mapped segments
    mapped_segments = {}
    
    # 1. Intro
    mapped_segments[f"{mid}_intro"] = {
        'title': 'Intro',
        'text': intro_text
    }
    
    # 2. Instructional segments
    for idx, sec in enumerate(non_sim_sections):
        seg_id = f"{mid}_segment_{idx + 1}"
        sec_text = clean_text(sec.get('content', ''))
        mapped_segments[seg_id] = {
            'title': sec.get('title', ''),
            'text': sec_text if sec_text else f"Module Section: {sec.get('title')}"
        }
    
    # 3. Transition
    mapped_segments[f"{mid}_transition"] = {
        'title': 'Transition to Simulation',
        'text': f"Complete the knowledge check, then launch simulation scenario {transition_scenario}. Focus on clear discovery, concise framing, and confident next-step language."
    }
    
    # Now, let's see what files are in audio inventory
    inv_files = audio_inventory.get(mid, {}).get('files', [])
    print(f"Inventory expected files ({len(inv_files)}):")
    for f in inv_files:
        # File name like mod_1_1_intro.mp3
        # Stem is like mod_1_1_intro
        stem = Path(f).stem
        if stem in mapped_segments:
            seg = mapped_segments[stem]
            print(f"  - {f} -> MATCHED! Title: '{seg['title']}' | Chars: {len(seg['text'])}")
        else:
            print(f"  - {f} -> NOT MATCHED IN PYTHON MAPPING!")
            # Let's print available keys
            print(f"    Available keys: {list(mapped_segments.keys())}")
