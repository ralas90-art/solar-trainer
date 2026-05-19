import json
import os

curriculum_path = os.path.join(os.path.dirname(__file__), "curriculum_map.json")
narration1 = os.path.join(os.path.dirname(__file__), "narration_transcripts_part1_updated.json")
narration2 = os.path.join(os.path.dirname(__file__), "narration_transcripts_part2_updated.json")
ts_out = os.path.join(os.path.dirname(__file__), "..", "solar-trainer", "frontend", "lib", "modules.ts")

with open(curriculum_path, 'r', encoding='utf-8') as f:
    curriculum = json.load(f)
with open(narration1, 'r', encoding='utf-8') as f:
    n1 = json.load(f)
with open(narration2, 'r', encoding='utf-8') as f:
    n2 = json.load(f)

all_narrations = {}
for part in [n1, n2]:
    for day in part.get("days", []):
        for mod in day.get("modules", []):
            all_narrations[mod["module_id"]] = mod

with open(ts_out, 'r', encoding='utf-8') as f:
    content = f.read()

prefix, rest1 = content.split('export const MODULES: Record<string, ModuleContent> = {', 1)

if '\n// Each module has an ordered list of scenarios' in rest1:
    module_marker, suffix = rest1.split('\n// Each module has an ordered list of scenarios', 1)
    suffix = '\n// Each module has an ordered list of scenarios' + suffix
else:
    module_marker, suffix = rest1.split('\nexport const MODULE_SCENARIOS', 1)
    suffix = '\nexport const MODULE_SCENARIOS' + suffix

def extract_mod_1_1(text):
    start = text.find('"mod_1_1": {')
    brace_count = 0
    in_mod = False
    end_idx = start
    for i in range(start, len(text)):
        if text[i] == '{':
            if not in_mod:
                in_mod = True
            brace_count += 1
        elif text[i] == '}':
            brace_count -= 1
            if in_mod and brace_count == 0:
                end_idx = i
                break
    return text[start:end_idx+1]

mod_1_1_code = extract_mod_1_1(module_marker)

out = []
out.append('export const MODULES: Record<string, ModuleContent> = {')
out.append('    // \u2500\u2500\u2500 MODULE 1.1 \u2014 Welcome & Vision Casting \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500')
out.append('    ' + mod_1_1_code)

for day in curriculum.get("days", []):
    for mod in day.get("modules", []):
        mod_id = mod["module_id"]
        if mod_id == "1.1":
            continue
            
        out.append(',')
        out.append(f'    // \u2500\u2500\u2500 MODULE {mod_id} \u2014 {mod["module_title"]} \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500')
        key = mod_id.replace(".", "_")
        
        narration_data = all_narrations.get(mod_id, {})
        slides = narration_data.get("slides", [])
        
        obj = {
            "id": f"mod_{key}",
            "title": f"Module {mod_id}: {mod['module_title']}",
            "subtitle": mod.get("lesson_objective", "")[:120],
            "sections": [],
            "workbookPrompts": []
        }
        
        if slides:
            for s in slides:
                obj["sections"].append({
                    "title": s["slide_title"],
                    "type": "text",
                    "content": s.get("narration", s.get("concept", ""))
                })
        else:
             obj["sections"].append({
                    "title": mod['module_title'],
                    "type": "text",
                    "content": mod.get('lesson_objective', 'Completed.')
             })
             
        wb_map = mod.get("workbook_mapping", {})
        if wb_map.get("workbook_present") or len(wb_map.get("workbook_exercise_names", [])) > 0:
             obj["workbookPrompts"].append({
                    "id": f"wb_{key}_1",
                    "type": "open_response",
                    "label": "What is the primary takeaway you had from this section?",
                    "placeholder": "Reflect on how this applies to your real-world scenarios",
                    "lines": 3
             })
        else:
             obj["workbookPrompts"].append({
                    "id": f"wb_{key}_1",
                    "type": "open_response",
                    "label": f"Reflect on {mod['module_title']}: How will you apply this?",
                    "placeholder": "Type your reflection here...",
                    "lines": 2
             })
             
        q_map = mod.get("quiz_mapping", {})
        if q_map.get("quiz_present") or any(s.get("quiz_flag") for s in slides):
            obj["quiz"] = {
                "title": f"Module {mod_id} Knowledge Check",
                "questions": [
                    {
                        "id": f"kc_{key}_a",
                        "question": f"What was the main concept covered in {mod['module_title']}?",
                        "options": [
                            "The concept taught in this module",
                            "An incorrect distractor",
                            "Another incorrect concept",
                            "None of the above"
                        ],
                        "correctAnswerIndex": 0,
                        "explanation": f"This is an autogenerated placeholder for the {mod_id} quiz."
                    }
                ]
            }
            
        json_str = json.dumps(obj, indent=4)
        out.append(f'    "mod_{key}": {json_str}')

out.append('}')

final_content = prefix + "\n".join(out) + suffix

with open(ts_out, 'w', encoding='utf-8') as f:
    f.write(final_content)

print(f"Successfully generated full curriculum into {ts_out}")
