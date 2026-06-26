import re
from pathlib import Path

def main():
    path = Path('_Archive_Legacy/2026-05-11/solar-trainer_leftovers/SeptiVolt_Delivery/ES/Curriculum/MASTER_CURRICULUM_PACK_V2_ES_Day1.md')
    if not path.exists():
        print("File does not exist")
        return
        
    content = path.read_text(encoding='utf-8')
    # Find Módulo 1.5a block
    start_pos = content.find("Módulo 1.5a")
    if start_pos == -1:
        start_pos = content.find("Módulo 1.5A")
    if start_pos == -1:
        print("Módulo 1.5a not found")
        return
        
    end_pos = content.find("Módulo 1.5b", start_pos)
    if end_pos == -1:
        end_pos = content.find("Módulo 1.5B", start_pos)
        
    if end_pos == -1:
        end_pos = len(content)
        
    block = content[start_pos:end_pos]
    print("=== Headings in mod_1_5a block ===")
    for line in block.split('\n'):
        if line.startswith('#'):
            print(line)
            
    print("\n=== Prompts and Quiz sections in mod_1_5a ===")
    idx = block.find("#### PROMPTS DEL CUADERNO")
    if idx != -1:
        print(block[idx:])
    else:
        print("No #### PROMPTS DEL CUADERNO found")

if __name__ == "__main__":
    main()
