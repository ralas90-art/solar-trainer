
import json
import re
import os

# Path to the modules file
modules_path = r'c:\Users\12132\Desktop\Antigravity Solar Sales Trainer Agent\solar-trainer\frontend\lib\modules.ts'

with open(modules_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Try to extract the MODULES object content
# It's defined as: export const MODULES: Record<string, ModuleContent> = { ... }
match = re.search(r'export const MODULES: Record<string, ModuleContent> = (\{.*\})', content, re.DOTALL)

if not match:
    # Fallback: maybe it's just { ... }
    match = re.search(r'const MODULES = (\{.*\})', content, re.DOTALL)

if not match:
    print("Could not find MODULES object")
    exit(1)

# The content might have trailing comments or commas that break JSON.loads
# We'll use a more surgical approach if needed, but let's try to clean it up.
raw_json = match.group(1)
# Crude cleanup: remove comments, trailing commas
raw_json = re.sub(r'//.*', '', raw_json)
raw_json = re.sub(r'/\*.*?\*/', '', raw_json, flags=re.DOTALL)
# This is still TS, not perfectly JSON. But we can parse it module by module.

# BETTER APPROACH: Use regex to find all module blocks "id": { ... }
# Look for pattern: "mod_X_Y": { ... }
modules = {}
module_matches = re.finditer(r'"(mod_[^"]+)":\s*(\{.*?\}\s*)(?=,\s*"mod_|$)', content, re.DOTALL)

def clean_ts_to_json(ts_str):
    # Remove trailing commas before closing braces/brackets
    ts_str = re.sub(r',\s*\}', '}', ts_str)
    ts_str = re.sub(r',\s*\]', ']', ts_str)
    # Remove comments
    ts_str = re.sub(r'//.*', '', ts_str)
    return ts_str

for m in module_matches:
    mod_id = m.group(1)
    mod_body = m.group(2)
    # Attempt to parse as JSON after cleaning
    try:
        # We need to wrap keys in quotes if they aren't (TS allows unquoted keys, JSON doesn't)
        # But in this file, keys seem to be quoted.
        # Let's try to just dump it into a pack manually by reading fields.
        pass
    except:
        pass

# Actually, I'll just iterate through the file and extract the data based on known markers.
output = []
output.append("# SEPTIVOLT MASTER CURRICULUM PACK")
output.append("This file contains the FULL content for all 7 days of training. Use this for Translation and Slide Generation.")
output.append("\n---\n")

curr_day = 0
# We can find the DAY_MODULES definition to get the order
day_matches = re.finditer(r'\{ dayNumber: (\d+), title: "(.*?)", modules: \[(.*?)\] \}', content, re.DOTALL)
days = []
for dm in day_matches:
    days.append({
        "number": dm.group(1),
        "title": dm.group(2),
        "module_ids": re.findall(r'id: "(mod_[^"]+)"', dm.group(3))
    })

# Now get module data
module_data = {}
# Find all "mod_id": { ... }
# This regex is tricky because of nested braces.
# We'll use a simpler one to find title/subtitle/sections
for mod_id_match in re.finditer(r'"(mod_[^"]+)":\s*\{', content):
    m_id = mod_id_match.group(1)
    start_pos = mod_id_match.end()
    # Find the matching closing brace (very naive but might work for this specific file structure)
    # Or just use the next module header as the end
    pass

# FALLBACK: Just extract everything using line-by-line scanning if needed.
# But I have the MODULES definition. I'll just use the IDs from DAY_MODULES to look them up.

def get_field(mod_id, field_name):
    # Find the mod_id block
    pattern = f'"{mod_id}":\\s*\\{{.*?\\bm{field_name}\\b["\']?:\\s*"(.*?)"'
    m = re.search(pattern, content, re.DOTALL)
    return m.group(1) if m else ""

def get_sections(mod_id):
    # Find sections array
    pattern = f'"{mod_id}":\\s*\\{{.*?sections:\\s*\\[(.*?)\\]\\s*,\\s*workbookPrompts'
    m = re.search(pattern, content, re.DOTALL)
    if not m:
        pattern = f'"{mod_id}":\\s*\\{{.*?sections:\\s*\\[(.*?)\\]\\s*,\\s*\\}}'
        m = re.search(pattern, content, re.DOTALL)
    
    if m:
        sections_raw = m.group(1)
        # Find all { title: "...", content: "..." }
        sec_matches = re.finditer(r'\{.*?title:\s*"(.*?)".*?content:\s*"(.*?)".*?\}', sections_raw, re.DOTALL)
        return [{"title": sm.group(1), "content": sm.group(2)} for sm in sec_matches]
    return []

for day in days:
    output.append(f"## DAY {day['number']}: {day['title']}")
    for mod_id in day['module_ids']:
        # Extract basic info
        title_m = re.search(f'"{mod_id}":\\s*\\{{.*?title:\\s*"(.*?)"', content, re.DOTALL)
        subtitle_m = re.search(f'"{mod_id}":\\s*\\{{.*?subtitle:\\s*"(.*?)"', content, re.DOTALL)
        
        title = title_m.group(1) if title_m else mod_id
        subtitle = subtitle_m.group(1) if subtitle_m else ""
        
        output.append(f"### {title}")
        output.append(f"- **ID:** {mod_id}")
        output.append(f"- **Subtitle:** {subtitle}")
        
        # Sections
        # Find the block for this module more precisely
        mod_block_m = re.search(f'"{mod_id}":\\s*(\\{{.*?\\}})(?:,\n\s*"(?:mod|DAY_MODULES)|$)', content, re.DOTALL)
        if mod_block_m:
            block = mod_block_m.group(1)
            
            # Content Sections
            output.append("#### CONTENT SECTIONS")
            sec_matches = re.finditer(r'\{[^{}]*?"title":\s*"(.*?)",[^{}]*?"type":\s*"(text|quote|list)",[^{}]*?"content":\s*"(.*?)"', block, re.DOTALL)
            for sm in sec_matches:
                output.append(f"**{sm.group(1)}**  \n{sm.group(3).replace('\\n', '\n')}\n")
            
            # Slides
            output.append("#### SLIDE DECK OUTLINE")
            slides_m = re.search(r'"type":\s*"slides",\s*"slides":\s*\[(.*?)\]', block, re.DOTALL)
            if slides_m:
                slide_list = re.finditer(r'\{[^{}]*?"title":\s*"(.*?)",[^{}]*?"content":\s*"(.*?)"', slides_m.group(1), re.DOTALL)
                for sl in slide_list:
                    output.append(f"- **Slide:** {sl.group(1)}  \n  *Notes:* {sl.group(2)}")
            else:
                output.append("*No specific slides defined for this module.*")

            # Workbook
            output.append("#### WORKBOOK PROMPTS")
            wb_m = re.search(r'"workbookPrompts":\s*\[(.*?)\]', block, re.DOTALL)
            if wb_m:
                prompts = re.findall(r'"label":\s*"(.*?)"', wb_m.group(1))
                for p in prompts:
                    output.append(f"- {p}")
            
            # Quiz
            output.append("#### QUIZ DATA")
            quiz_m = re.search(r'"quiz":\s*\{(.*?)\}', block, re.DOTALL)
            if quiz_m:
                questions = re.finditer(r'"question":\s*"(.*?)".*?"options":\s*\[(.*?)\].*?"correctAnswerIndex":\s*(\d)', quiz_m.group(1), re.DOTALL)
                for q in questions:
                    output.append(f"- **Q:** {q.group(1)}")
                    options = re.findall(r'"(.*?)"', q.group(2))
                    output.append(f"  *Options:* {', '.join(options)}")
                    output.append(f"  *Correct Index:* {q.group(3)}")
        
        output.append("\n---\n")

# Save to file
target_file = r'C:\Users\12132\.gemini\antigravity\brain\3f645f15-89e0-4ea8-b403-19bf1c9c2b22\MASTER_CURRICULUM_PACK.md'
with open(target_file, 'w', encoding='utf-8') as f:
    f.write("\n".join(output))

print(f"Successfully generated {target_file}")
