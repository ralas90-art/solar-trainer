import sys
import os

# Add the current directory to sys.path to import the scripts
sys.path.append(os.getcwd())

try:
    from generate_narration_part1 import PART1
except ImportError:
    PART1 = None

try:
    from generate_narration_part2 import PART2
except ImportError:
    PART2 = None

def process_part(part_data, file_handle):
    if not part_data:
        return
    
    for day in part_data.get('days', []):
        day_num = day.get('day_number')
        day_title = day.get('day_title')
        file_handle.write(f"# DAY {day_num}: {day_title}\n\n")
        
        for module in day.get('modules', []):
            mod_id = module.get('module_id')
            mod_title = module.get('module_title')
            file_handle.write(f"## Module {mod_id}: {mod_title}\n\n")
            
            # Combine all slide narrations for ElevenLabs "clean paste"
            full_narration = ""
            for slide in module.get('slides', []):
                narration = slide.get('narration', "").strip()
                if narration:
                    full_narration += narration + " "
            
            file_handle.write(f"**Full Narration:**\n{full_narration.strip()}\n\n")
            file_handle.write("---\n\n")

def main():
    with open('ElevenLabs_Transcripts_MainDays_EN.md', 'w', encoding='utf-8') as f:
        f.write("# ElevenLabs Narration Transcripts - Main Days (English)\n\n")
        f.write("This file contains the consolidated narration scripts for the SeptiVolt Solar Sales Rep Accelerator.\n\n")
        
        process_part(PART1, f)
        process_part(PART2, f)

if __name__ == "__main__":
    main()
