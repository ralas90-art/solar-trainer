import os
import re

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    new_lines = []
    i = 0
    modified = False
    while i < len(lines):
        line = lines[i]
        new_lines.append(line)
        if 'type: "list"' in line or 'type: "checklist"' in line or '"type": "list"' in line or '"type": "checklist"' in line:
            # Check if content exists in this object
            # Scan ahead to see if content is before the next closing brace or type
            found_content = False
            found_closing = False
            j = i + 1
            search_range = 15
            while j < len(lines) and j < i + search_range:
                if 'content:' in lines[j] or '"content":' in lines[j]:
                    found_content = True
                    break
                if '}' in lines[j] and 'sections' not in lines[j]: # Simple heuristic for end of object
                    found_closing = True
                    break
                if 'type:' in lines[j] or '"type":' in lines[j]:
                    break
                j += 1
            
            if not found_content:
                # Add content: ""
                indent = re.match(r'^\s*', line).group()
                # Find if it's JS or JSON
                if '"type":' in line:
                    new_lines.append(f'{indent}"content": "",\n')
                else:
                    new_lines.append(f'{indent}content: "",\n')
                modified = True
                print(f"Fixed violation in {filepath} at line {i+1}")
        i += 1
    
    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        return True
    return False

files_to_check = [
    'lib/modules.ts',
    'lib/modules_es.ts',
    'lib/v2_day1_additive_modules.ts'
]

for f in files_to_check:
    path = os.path.join(os.getcwd(), f)
    if os.path.exists(path):
        fix_file(path)
    else:
        print(f"File not found: {path}")
