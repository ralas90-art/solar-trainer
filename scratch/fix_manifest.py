import json
import re

def fix_manifest():
    with open("artifacts/batch_1_dry_run_report.json", "r", encoding="utf-8") as f:
        report = json.load(f)

    with open("frontend/lib/audio-manifest.ts", "r", encoding="utf-8") as f:
        content = f.read()

    for module in report["modules"]:
        mod_id = module["moduleId"]
        # Find the segments array for this module
        mod_pattern = rf'(mod_{mod_id.split("_")[1]}_{mod_id.split("_")[2]}:\s*\{{.*?segments:\s*\[)(.*?)(\]\s*\}})'
        
        match = re.search(mod_pattern, content, flags=re.DOTALL)
        if not match:
            print(f"Could not find module {mod_id} in manifest.")
            continue
            
        prefix = match.group(1)
        segments_str = match.group(2)
        suffix = match.group(3)
        
        new_segments_str = segments_str
        
        for file_info in module["files"]:
            file_name = file_info["fileName"]
            title = file_info["title"]
            file_url = f"/audio/modules/{mod_id}/{file_name}"
            
            # Check if this file_url is in the segments_str
            if file_url not in new_segments_str:
                # Add it
                # example id: "mod_1_2_segment_2"
                seg_id = file_name.replace(".mp3", "")
                
                new_entry = f'\n      {{ id: "{seg_id}", title: "{title}", fileUrl: "{file_url}", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" }},'
                
                # Insert it before the transition if possible, or at the end
                if "transition" in new_segments_str and "transition" not in seg_id:
                    new_segments_str = re.sub(r'(\n\s*\{\s*id:\s*"[^"]*transition.*)', new_entry + r'\1', new_segments_str, count=1)
                else:
                    new_segments_str += new_entry
                    
            else:
                # Ensure it has the metadata properties
                search_pattern = rf'(fileUrl:\s*"{file_url}",\s*hasStaticAsset:\s*true)(\s*\}})'
                replacement = r'\1, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" \2'
                new_segments_str = re.sub(search_pattern, replacement, new_segments_str)

        content = content[:match.start()] + prefix + new_segments_str + suffix + content[match.end():]
        print(f"Fixed {mod_id}")

    with open("frontend/lib/audio-manifest.ts", "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    fix_manifest()
