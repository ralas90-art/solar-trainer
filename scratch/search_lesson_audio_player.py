with open('frontend/components/training-audio/lesson-audio-player.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"Total lines in lesson-audio-player.tsx: {len(lines)}")
for idx, line in enumerate(lines):
    if 'narration' in line.lower() or 'text' in line.lower() or 'content' in line.lower() or 'resolve' in line.lower():
        print(f"Line {idx+1}: {line.strip()}")
