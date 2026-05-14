
import json
import re
import os

modules_path = r'c:\Users\12132\Desktop\Antigravity Solar Sales Trainer Agent\solar-trainer\frontend\lib\modules.ts'

with open(modules_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Improved regex for DAY_MODULES - find the whole array
day_modules_match = re.search(r'export const DAY_MODULES: DayInfo\[\] = \[(.*?)\];\n\nexport const MODULES', content, re.DOTALL)

if not day_modules_match:
    # Try finding it between DAY_MODULES and MODULES
    day_modules_match = re.search(r'export const DAY_MODULES.*?\n\s*\[(.*?)\]\s*;\s*\n\s*export const MODULES', content, re.DOTALL)

if not day_modules_match:
    print("Could not find DAY_MODULES array")
    # Let's try to just find all day segments
    day_segments = re.findall(r'\{\s*dayNumber:\s*(\d+).*?title:\s*"(.*?)".*?modules:\s*\[(.*?)\]\s*\}', content, re.DOTALL)
else:
    day_segments = re.findall(r'\{\s*dayNumber:\s*(\d+).*?title:\s*"(.*?)".*?modules:\s*\[(.*?)\]\s*\}', day_modules_match.group(1), re.DOTALL)

days = []
for ds in day_segments:
    days.append({
        "number": ds[0],
        "title": ds[1],
        "module_ids": re.findall(r'id:\s*"(mod_[^"]+)"', ds[2])
    })

# Extract all module definitions from the MODULES object
# Strategy: find '"mod_X_Y": {' and then extract until the next module ID or the end of the object.
# Find the start of MODULES
modules_start_idx = content.find('export const MODULES')
if modules_start_idx == -1:
    modules_start_idx = content.find('const MODULES')

modules_content = content[modules_start_idx:]

output = []
output.append("# SEPTIVOLT MASTER CURRICULUM PACK")
output.append("This file contains the FULL content for all 7 days of training. Use this for Translation and Slide Generation.")
output.append("\n---\n")

for day in days:
    output.append(f"## DAY {day['number']}: {day['title']}")
    for mod_id in day['module_ids']:
        # Find the block for this module
        # Regex for "id": { modules }
        pattern = f'"{mod_id}":\\s*\\{{(.*?)\\n\\s*(?:\\}},?|(?:"mod_))'
        # Actually, let's just find the closing brace by counting braces or looking for the next ID
        mod_start = modules_content.find(f'"{mod_id}":')
        if mod_start == -1:
            continue
        
        # Find the end of this module (next "mod_" at start of line, or end of record)
        # We'll use a safer way: look for the start of the next module
        next_mod_search = re.search(r'\n\s*"(mod_[^"]+)":', modules_content[mod_start+10:])
        if next_mod_search:
            mod_block = modules_content[mod_start : mod_start + 10 + next_mod_search.start()]
        else:
            mod_block = modules_content[mod_start:]

        # Extract Title and Subtitle
        title_m = re.search(r'"title":\s*"(.*?)"', mod_block)
        sub_m = re.search(r'"subtitle":\s*"(.*?)"', mod_block)
        
        title = title_m.group(1) if title_m else mod_id
        subtitle = sub_m.group(1) if sub_m else ""
        
        output.append(f"### {title}")
        output.append(f"- **ID:** {mod_id}")
        output.append(f"- **Subtitle:** {subtitle}")
        
        # Sections
        output.append("#### CONTENT SECTIONS")
        # Extract the sections array block
        sections_m = re.search(r'"sections":\s*\[(.*?)\]\s*,\s*"workbookPrompts"', mod_block, re.DOTALL)
        if not sections_m:
             sections_m = re.search(r'"sections":\s*\[(.*?)\]\s*,?\s*\}', mod_block, re.DOTALL)

        if sections_m:
            sections_raw = sections_m.group(1)
            # Find all { title: "...", content: "..." }
            # Note: types can vary
            sec_matches = re.finditer(r'\{[^{}]*?"title":\s*"(.*?)".*?"content":\s*"(.*?)"', sections_raw, re.DOTALL)
            found_sec = False
            for sm in sec_matches:
                found_sec = True
                content_text = sm.group(2).replace("\\n", "\n").replace('\\"', '"')
                output.append(f"**{sm.group(1)}**  \n{content_text}\n")
            
            # Look for "items" if it's a list
            list_matches = re.finditer(r'\{[^{}]*?"title":\s*"(.*?)".*?"type":\s*"list".*?"items":\s*\[(.*?)\]', sections_raw, re.DOTALL)
            for lm in list_matches:
                found_sec = True
                items = re.findall(r'"(.*?)"', lm.group(2))
                output.append(f"**{lm.group(1)} (List)**")
                for item in items:
                    output.append(f"- {item}")
                output.append("")

            if not found_sec:
                output.append("*Section content extraction error or empty sections.*")
        
        # Slides
        output.append("#### SLIDE DECK OUTLINE")
        # Slides are often inside a section
        slides_m = re.search(r'"type":\s*"slides",\s*"slides":\s*\[(.*?)\]', mod_block, re.DOTALL)
        if slides_m:
            slide_list = re.finditer(r'\{[^{}]*?"title":\s*"(.*?)",[^{}]*?"content":\s*"(.*?)"', slides_m.group(1), re.DOTALL)
            for sl in slide_list:
                output.append(f"- **Slide:** {sl.group(1)}  \n  *Notes:* {sl.group(2).replace('\\n', ' ')}")
        else:
            output.append("*No specific slides defined for this module.*")

        # Workbook
        output.append("#### WORKBOOK PROMPTS")
        wb_m = re.search(r'"workbookPrompts":\s*\[(.*?)\]', mod_block, re.DOTALL)
        if wb_m:
            prompts = re.findall(r'"label":\s*"(.*?)"', wb_m.group(1))
            for p in prompts:
                output.append(f"- {p}")
        
        # Quiz
        output.append("#### QUIZ DATA")
        quiz_m = re.search(r'"quiz":\s*\{(.*?)\}', mod_block, re.DOTALL)
        if quiz_m:
            # Questions array
            questions_raw_m = re.search(r'"questions":\s*\[(.*?)\]', quiz_m.group(1), re.DOTALL)
            if questions_raw_m:
                questions = re.finditer(r'\{[^{}]*?"question":\s*"(.*?)".*?"options":\s*\[(.*?)\].*?"correctAnswerIndex":\s*(\d)', questions_raw_m.group(1), re.DOTALL)
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
