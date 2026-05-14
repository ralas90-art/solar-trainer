import os

def cleanup(filepath):
    if not os.path.exists(filepath):
        print(f"Skipping {filepath}")
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    new_lines = []
    removed_count = 0
    for line in lines:
        stripped = line.strip()
        # My script added these on their own lines
        if stripped == 'content: "",' or stripped == '"content": "",':
            removed_count += 1
            continue
        new_lines.append(line)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print(f"Removed {removed_count} lines from {filepath}")

files = ['lib/modules_es.ts', 'lib/v2_day1_additive_modules.ts']
for f in files:
    cleanup(f)
