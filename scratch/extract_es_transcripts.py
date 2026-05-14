import os
import re

def extract_es_transcripts():
    es_docs_dir = r"c:\Users\12132\Desktop\Antigravity Solar Sales Trainer Agent\ES Docs"
    files = [
        "MASTER_CURRICULUM_PACK_V2_ES_Day1.md",
        "MASTER_CURRICULUM_PACK_V2_ES_Days2-3.md",
        "MASTER_CURRICULUM_PACK_V2_ES_Day4.md",
        "MASTER_CURRICULUM_PACK_V2_ES_Day5.md",
        "MASTER_CURRICULUM_PACK_V2_ES_Days6-7.md"
    ]
    
    output_file = r"c:\Users\12132\Desktop\Antigravity Solar Sales Trainer Agent\ES Docs\ElevenLabs_Transcripts_MainDays_ES.md"
    
    with open(output_file, "w", encoding="utf-8") as out:
        out.write("# ELEVENLABS NARRATION TRANSCRIPTS - ES\n")
        out.write("## PRODUCTION-READY SPANISH NARRATION\n\n")
        
        for filename in files:
            filepath = os.path.join(es_docs_dir, filename)
            if not os.path.exists(filepath):
                print(f"Skipping {filename}, not found.")
                continue
                
            print(f"Processing {filename}...")
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
                
            # Find Modules
            # Pattern: ### Módulo X.X: Name or ### mod_X_X
            modules = re.split(r'### (?:Módulo |mod_)', content)
            
            for mod in modules[1:]: # Skip preamble
                # Extract ID and Title
                header_line = mod.split('\n')[0].strip()
                # If mod_1_1 style, clean it
                header_line = header_line.replace('_', '.')
                
                # Extract SECCIONES DE CONTENIDO
                content_match = re.search(r'#### SECCIONES DE CONTENIDO(.*?)(?=####|---|###|$)', mod, re.DOTALL)
                if content_match:
                    narration = content_match.group(1).strip()
                    # Clean up bolding and markers
                    narration = re.sub(r'\*\*(.*?)\*\*', r'\1', narration)
                    narration = re.sub(r'>.*?\n', '', narration) # Remove blockquotes
                    
                    if narration:
                        out.write(f"### MODULE {header_line}\n")
                        out.write(f"{narration}\n\n")
                        out.write("---\n\n")

    print(f"Extraction complete: {output_file}")

if __name__ == "__main__":
    extract_es_transcripts()
