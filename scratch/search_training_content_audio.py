with open('frontend/components/training-content.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if 'audio' in line.lower() or 'narration' in line.lower() or 'speak' in line.lower() or 'play' in line.lower():
        print(f"Line {idx+1}: {line.strip()}")
