"""
extract_slide_modules.py
Reads each day's PDF and prints which slide number each module starts on.
Uses pdfplumber. Run: python extract_slide_modules.py
"""
import os, re
try:
    import pdfplumber
except ImportError:
    import subprocess, sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pdfplumber"])
    import pdfplumber

SLIDES_DIR = os.path.join("frontend", "public", "slides")

FILES = {
    1: "Day_1_Foundation.pdf",
    2: "Day_2_Prospecting.pdf",
    3: "Day_3_Discovery.pdf",
    4: "Day_4_Presentation.pdf",
    5: "Day_5_Objections.pdf",
    6: "Day_6_Mastery.pdf",
    7: "Day_7_Certification.pdf",
}

# Pattern: "Module 1.1", "Module 2.3", "1.1:", "MOD 1.1" etc.
MOD_PATTERN = re.compile(
    r'(?:module\s*|mod\s*)?(\d)[\.\-_](\d{1,2})(?:\s*[:\-–]|\s|$)',
    re.IGNORECASE
)

results = {}

for day, filename in FILES.items():
    path = os.path.join(SLIDES_DIR, filename)
    if not os.path.exists(path):
        print(f"  [MISSING] {path}")
        continue

    day_map = {}
    with pdfplumber.open(path) as pdf:
        total = len(pdf.pages)
        print(f"\nDay {day} — {filename} ({total} slides)")
        for i, page in enumerate(pdf.pages):
            text = page.extract_text() or ""
            matches = MOD_PATTERN.findall(text)
            for (d, m) in matches:
                d, m = int(d), int(m)
                if d == day:
                    key = f"mod_{d}_{m}"
                    if key not in day_map:
                        day_map[key] = i + 1  # 1-indexed slide
                        print(f"  {key} → slide {i + 1}  | text snippet: {text[:80].strip()!r}")

    results[day] = day_map

print("\n\n=== FULL RESULTS (paste into config.ts) ===")
print("export const SLIDE_START_PAGES: Record<string, number> = {")
for day, day_map in sorted(results.items()):
    for mod_id, slide in sorted(day_map.items()):
        print(f'  "{mod_id}": {slide},')
print("}")
