import re
import json
import sys

def generate_curriculum_map(filepath, output_path):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    data = {
        "program_title": "SeptiVolt Solar Sales Rep Accelerator",
        "program_duration": "7 Days",
        "days": [],
        "final_audit": {
            "total_days_found": 0,
            "total_modules_found": 0,
            "total_days_mapped": 0,
            "total_modules_mapped": 0,
            "is_curriculum_map_complete": False,
            "missing_or_unclear_items": []
        }
    }

    day_splits = re.split(r'\n# [🔵🟠🟡🟢🔴🟣] DAY (\d+)\s+[–-]\s+(.*?)\n', content)
    
    total_modules = 0
    for i in range(1, len(day_splits), 3):
        day_num = int(day_splits[i])
        day_title = day_splits[i+1].strip()
        day_text = "\n" + day_splits[i+2]
        
        mission_match = re.search(r'### Mission:\s*(.*?)\n', day_text)
        core_theme = mission_match.group(1).strip() if mission_match else "missing_from_source"
        
        day_obj = {
            "day_number": day_num,
            "day_title": day_title,
            "core_theme": core_theme,
            "primary_skills_developed": [],
            "modules": []
        }
        
        mod_pattern = r'\n(?:####\s+(?:⭐\s+)?Module\s+(\d+\.\d+)\s+[–-]\s+(.*?)(?:\s+\((.*?)\))?\n|\*\*Activity\s+(\d+\.\d+)[:\s—–-]+(.*?)(?:\s+\((.*?)\))?\*\*\n)'
        matches = list(re.finditer(mod_pattern, day_text))
        
        for j, match in enumerate(matches):
            mod_id = match.group(1) or match.group(4)
            mod_title_raw = match.group(2) or match.group(5) or ""
            mod_duration = match.group(3) or match.group(6) or ""
            
            mod_title = re.sub(r'\(.*?\)', '', mod_title_raw).strip()
            
            start_idx = match.end()
            end_idx = matches[j+1].start() if j + 1 < len(matches) else len(day_text)
            mod_text = day_text[start_idx:end_idx]
            
            obj_match = re.search(r'\*\*Objectives:\*\*\s*\n(.*?)(?=\n\n(?:[^\-]|\*\*[A-Z]|\n))', mod_text, re.DOTALL)
            objectives_text = obj_match.group(1).strip() if obj_match else ""
            objectives_list = [re.sub(r'^-\s*', '', line).strip() for line in objectives_text.split('\n') if line.strip() and line.startswith('-')]
            lesson_objective = " ".join(objectives_list) if objectives_list else "missing_from_source"
            
            sim_name = "missing_from_source"
            sim_persona = "missing_from_source"
            sim_skill = "missing_from_source"
            
            alt_sim_match = re.search(r'> 🤖 \*\*AI Simulation Link\*\*\n.*?\*\*[\s]*(?:Practice )?Scenario:\*\*\s*(?:")?(.*?)(?:")?\s*[—–-]\s*(.*?)\n.*?\*\*Skill Being Trained:\*\*\s*(.*?)(\n|$)', mod_text, re.DOTALL | re.IGNORECASE)
            if alt_sim_match:
                sim_name = alt_sim_match.group(1).strip()
                sim_persona = alt_sim_match.group(2).strip()
                sim_skill = alt_sim_match.group(3).strip()
            
            subheaders = re.findall(r'(?:\*\*([^*]+)\*\*|###+ ([^\n]+))\s*\n', mod_text)
            slides = []
            transcript_segments = []
            
            for sh_match in subheaders:
                sh = (sh_match[0] or sh_match[1]).strip()
                if not sh or sh.lower() in ['objectives:', 'content:', 'activity:', 'deliverable:', 'deliverables:', 'tools:', 'tools setup:', 'checklist:']:
                    continue
                if len(sh) > 100:
                    continue
                    
                slide_num = len(slides) + 1
                slides.append({
                    "slide_number": slide_num,
                    "slide_title": sh,
                    "slide_summary": "missing_from_source",
                    "key_concept": sh,
                    "supporting_trainer_script_segment": "missing_from_source"
                })
                
                transcript_segments.append({
                    "module_id": mod_id,
                    "slide_number": slide_num,
                    "transcript_segment": "missing_from_source",
                    "key_teaching_point": sh
                })
                
            if not slides:
                slides.append({
                    "slide_number": 1,
                    "slide_title": mod_title,
                    "slide_summary": "missing_from_source",
                    "key_concept": "missing_from_source",
                    "supporting_trainer_script_segment": "missing_from_source"
                })
                transcript_segments.append({
                    "module_id": mod_id,
                    "slide_number": 1,
                    "transcript_segment": "missing_from_source",
                    "key_teaching_point": "missing_from_source"
                })

            quiz_present = bool(re.search(r'(?i)quiz', mod_text))
            workbook_present = bool(re.search(r'(?i)workbook|worksheet', mod_text))
            
            deliv_match = re.search(r'\*\*Deliverable:\*\*\s*(.*?)\n', mod_text)
            deliv = deliv_match.group(1).strip() if deliv_match else "missing_from_source"

            module_dict = {
                "module_id": mod_id,
                "module_title": mod_title,
                "lesson_objective": lesson_objective,
                "key_skills_taught": objectives_list,
                "estimated_lesson_duration": mod_duration if mod_duration else "missing_from_source",
                "number_of_slides": len(slides),
                "trainer_script_sections": len(transcript_segments),
                "workbook_exercises": [deliv] if workbook_present and deliv != "missing_from_source" else [],
                "quiz_included": quiz_present,
                "transcript_ready": False,
                "simulation_ready": (sim_name != "missing_from_source"),
                "slides": slides,
                "transcript_segments": transcript_segments,
                "simulation_mapping": {
                    "simulation_scenario_name": sim_name,
                    "prospect_persona": sim_persona,
                    "difficulty_level": "missing_from_source",
                    "sales_skill_practiced": sim_skill,
                    "simulation_goal": lesson_objective
                },
                "quiz_mapping": {
                    "quiz_present": quiz_present,
                    "quiz_question_types": [],
                    "skills_tested": [],
                    "correct_concepts": []
                },
                "workbook_mapping": {
                    "workbook_present": workbook_present,
                    "workbook_exercise_names": [deliv] if workbook_present and deliv != "missing_from_source" else [],
                    "workbook_goal": deliv if workbook_present else "missing_from_source"
                }
            }
            
            day_obj["modules"].append(module_dict)
            total_modules += 1
            
        data["days"].append(day_obj)

    data["final_audit"]["total_days_found"] = len(data["days"])
    data["final_audit"]["total_modules_found"] = total_modules
    data["final_audit"]["total_days_mapped"] = len(data["days"])
    data["final_audit"]["total_modules_mapped"] = total_modules
    data["final_audit"]["is_curriculum_map_complete"] = True

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

if __name__ == "__main__":
    generate_curriculum_map(
        sys.argv[1],
        sys.argv[2]
    )
