with open('frontend/components/training-content.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if 'lesson={' in line or 'ModuleAudioLesson' in line:
        print(f"Line {idx+1}: {line.strip()}")
        # print surrounding 10 lines
        start = max(0, idx - 10)
        end = min(len(lines), idx + 10)
        for i in range(start, end):
            print(f"  {i+1}: {lines[i].strip()}")
        print("-" * 50)
