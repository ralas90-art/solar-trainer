import os
import re
import json

def count_files_in_dir(directory):
    if not os.path.exists(directory):
        return 0
    count = 0
    for root, dirs, files in os.walk(directory):
        count += len([f for f in files if f.endswith('.mp3')])
    return count

def parse_v2_transcripts(file_path):
    """Parses the additive V2 modules markdown file (handles EN 'Module' and ES 'Módulo')."""
    if not os.path.exists(file_path):
        return []
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Modules are defined by ## Module/Módulo ID – Title
    modules = []
    # Use a more flexible regex for Module/Módulo
    mod_matches = re.finditer(r'## (?:Module|Módulo)\s+([\d\.\w]+)[–\- ]+(.*?)\n(.*?)(?=\n##|$)', content, re.S)
    
    for mod in mod_matches:
        mod_id_raw = mod.group(1)
        # Normalize ID: 1.5A -> mod_1_5a
        mod_id = f"mod_{mod_id_raw.lower().replace('.', '_')}"
        mod_content = mod.group(3)
        
        # Slides: Slide X or Diapositiva X
        slide_matches = re.finditer(r'(?:Slide|Diapositiva)\s+(\d+)\n\n(.*?)(?=\n(?:Slide|Diapositiva|---)|$)', mod_content, re.S)
        slides = []
        for slide in slide_matches:
            slide_num = slide.group(1)
            text = slide.group(2).strip()
            if text:
                slides.append({
                    'num': slide_num,
                    'text': text
                })
        
        if slides:
            modules.append({
                'id': mod_id,
                'slides': slides
            })
    return modules

def parse_main_days_es(file_path):
    """Parses the Spanish Main Days markdown file."""
    if not os.path.exists(file_path):
        return []
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modules = []
    mod_matches = re.finditer(r'## (?:Module|Módulo)\s+([\d\.]+):\s+(.*?)\n(.*?)(?=\n##|$)', content, re.S)
    
    for mod in mod_matches:
        mod_id_raw = mod.group(1)
        mod_id = f"mod_{mod_id_raw.lower().replace('.', '_')}"
        mod_content = mod.group(3)
        
        text_match = re.search(r'\*\*Narración Completa:\*\*\n\n(.*?)(?=$)', mod_content, re.S)
        text = text_match.group(1).strip() if text_match else ""
        
        if text:
            modules.append({
                'id': mod_id,
                'text': text
            })
    return modules

def generate_report():
    base_path = r'c:\Users\12132\Desktop\Antigravity Solar Sales Trainer Agent'
    core_en_path = os.path.join(base_path, 'frontend', 'public', 'audio', 'modules')
    # Update paths to canonical SeptiVolt_Delivery structure
    v2_en_transcript = os.path.join(base_path, 'SeptiVolt_Delivery', 'EN', 'ElevenLabs_Transcripts', 'ElevenLabs_Transcripts_V2_Modules.md')
    v2_es_transcript_additive = os.path.join(base_path, 'SeptiVolt_Delivery', 'ES', 'ElevenLabs_Transcripts', 'ElevenLabs_Transcripts_V2_Modules_ES.md')
    v2_es_transcript_main = os.path.join(base_path, 'SeptiVolt_Delivery', 'ES', 'ElevenLabs_Transcripts', 'ElevenLabs_Transcripts_MainDays_ES.md')
    
    v2_en_target = os.path.join(base_path, 'public', 'audio', 'v2', 'en')
    v2_es_target = os.path.join(base_path, 'public', 'audio', 'v2', 'es')
    
    # 1. Existing English audio count
    existing_en_core_count = count_files_in_dir(core_en_path)
    
    # 2. English V2 Additive
    en_v2_modules = parse_v2_transcripts(v2_en_transcript)
    en_v2_slides_count = sum(len(m['slides']) for m in en_v2_modules)
    en_v2_chars = sum(len(s['text']) for m in en_v2_modules for s in m['slides'])
    
    existing_en_v2_count = count_files_in_dir(v2_en_target)
    # Check for missing slides specifically
    missing_en_v2_list = []
    for mod in en_v2_modules:
        for slide in mod['slides']:
            target_file = os.path.join(v2_en_target, mod['id'], f"slide_{slide['num']}.mp3")
            if not os.path.exists(target_file):
                missing_en_v2_list.append(slide)
    
    # 3. Spanish V2
    es_v2_additive_modules = parse_v2_transcripts(v2_es_transcript_additive)
    es_v2_main_modules = parse_main_days_es(v2_es_transcript_main)
    
    manifest_path = os.path.join(base_path, 'SeptiVolt_Delivery', 'EN', 'ElevenLabs_Transcripts', 'ElevenLabs_Production_Manifest.json')
    with open(manifest_path, 'r', encoding='utf-8') as f:
        manifest = json.load(f)
    mod_slide_map = {m['module_id']: m['slide_count'] for m in manifest['modules']}
    
    # Slides for Additive ES
    es_v2_additive_slides_count = sum(len(m['slides']) for m in es_v2_additive_modules)
    es_v2_additive_chars = sum(len(s['text']) for m in es_v2_additive_modules for s in m['slides'])
    
    # Slides for Main ES (estimate based on manifest)
    es_v2_main_slides_count = 0
    es_v2_main_chars = 0
    for m in es_v2_main_modules:
        slide_count = mod_slide_map.get(m['id'], 1)
        es_v2_main_slides_count += slide_count
        es_v2_main_chars += len(m['text'])
        
    total_es_slides = es_v2_additive_slides_count + es_v2_main_slides_count
    total_es_chars = es_v2_additive_chars + es_v2_main_chars
    
    existing_es_v2_count = count_files_in_dir(v2_es_target)
    
    # Reporting
    print("### SEPTIVOLT AUDIO PRODUCTION READINESS REPORT")
    print(f"- **Existing English Core Audio Count**: {existing_en_core_count}")
    print(f"- **Missing English V2 Additive Audio Count**: {len(missing_en_v2_list)} (out of {en_v2_slides_count} total V2 slides)")
    print(f"- **Spanish Transcript Slide Count (Full Set)**: {total_es_slides}")
    print(f"  - Core Modules (ES): {es_v2_main_slides_count}")
    print(f"  - Additive V2 Modules (ES): {es_v2_additive_slides_count}")
    print(f"- **Existing Spanish Audio Count**: {existing_es_v2_count}")
    print(f"- **Missing Spanish Audio Count**: {total_es_slides - existing_es_v2_count}")
    print(f"- **Estimated ElevenLabs Character Usage**: {en_v2_chars + total_es_chars:,}")
    print(f"  - English V2 Additive: {en_v2_chars:,}")
    print(f"  - Spanish Full Set: {total_es_chars:,}")
    print(f"- **Estimated total MP3 files to generate**: {len(missing_en_v2_list) + (total_es_slides - existing_es_v2_count)}")

if __name__ == "__main__":
    generate_report()
