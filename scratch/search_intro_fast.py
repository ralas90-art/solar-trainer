from pathlib import Path
import sys

sys.stdout.reconfigure(encoding='utf-8')

search_term = "mod_1_1_intro"
print(f"Searching for occurrences of '{search_term}'...")

dirs_to_check = [
    Path('.'),
    Path('scripts'),
    Path('frontend/src'),
    Path('frontend/public'),
    Path('backend'),
]

checked_files = 0
for d in dirs_to_check:
    if not d.exists():
        continue
    # Glob files only in this folder, not recursive, unless we explicitly glob in subfolders we care about
    files = list(d.glob('*.json')) + list(d.glob('*.py')) + list(d.glob('*.ts')) + list(d.glob('*.tsx')) + list(d.glob('*.js')) + list(d.glob('*.md'))
    
    # If recursive for scripts or frontend/src
    if d.name in ['scripts', 'src', 'backend']:
        files += list(d.glob('**/*.json')) + list(d.glob('**/*.py')) + list(d.glob('**/*.ts')) + list(d.glob('**/*.tsx')) + list(d.glob('**/*.js'))

    for p in files:
        if p.is_dir() or 'node_modules' in p.parts or '.git' in p.parts or '.vercel' in p.parts or '.venv' in p.parts:
            continue
        try:
            content = p.read_text(encoding='utf-8', errors='ignore')
            if search_term in content:
                print(f"FOUND in: {p}")
            checked_files += 1
        except Exception as e:
            pass

print(f"Checked {checked_files} files.")
