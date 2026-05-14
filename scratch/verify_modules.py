import re
import sys

def check_modules(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract DAY_MODULES_ES IDs
    day_modules_pattern = re.compile(r'id:\s*["\'](mod_[\d_a-z]+)["\']')
    day_ids = day_modules_pattern.findall(content.split('export const MODULES_ES')[0])
    
    # Extract MODULES_ES keys
    modules_pattern = re.compile(r'["\'](mod_[\d_a-z]+)["\']:\s*\{')
    module_keys = modules_pattern.findall(content.split('export const MODULES_ES')[1])

    print(f"Total IDs in DAY_MODULES_ES: {len(day_ids)}")
    print(f"Total Keys in MODULES_ES: {len(module_keys)}")

    # Check for duplicates in MODULES_ES
    duplicates = [k for k in set(module_keys) if module_keys.count(k) > 1]
    if duplicates:
        print(f"ERROR: Duplicate keys in MODULES_ES: {duplicates}")
    else:
        print("No duplicate keys in MODULES_ES.")

    # Check if all day_ids exist in module_keys
    missing = [id for id in day_ids if id not in module_keys]
    if missing:
        print(f"ERROR: Missing keys in MODULES_ES for IDs in DAY_MODULES_ES: {missing}")
    else:
        print("All IDs in DAY_MODULES_ES exist in MODULES_ES.")

    # Check for old schema (workbookPrompts)
    if "workbookPrompts" in content.split('export const MODULES_ES')[1]:
        print("ERROR: 'workbookPrompts' still exists in MODULES_ES content.")
    else:
        print("No 'workbookPrompts' found in MODULES_ES content.")

if __name__ == "__main__":
    check_modules(sys.argv[1])
