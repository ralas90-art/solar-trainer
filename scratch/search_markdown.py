import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
curriculum_dir = "_Archive_Legacy/2026-05-11/solar-trainer_leftovers/SeptiVolt_Delivery/ES/Curriculum"
files = sorted(os.listdir(curriculum_dir))

for f in files:
    path = os.path.join(curriculum_dir, f)
    try:
        content = open(path, encoding='utf-8').read()
    except Exception:
        content = open(path, encoding='latin1').read()
        
    # Search for any references to mod_1_1 or income goal or stage of competence
    if "mod_1_1" in content:
        print(f"Found 'mod_1_1' in {f}")
    if "competencia" in content.lower():
        print(f"Found 'competencia' in {f}")
    if "cuaderno" in content.lower():
        print(f"Found 'cuaderno' in {f}")
