import os
import re
from pathlib import Path

# Mock White Label for interpolation
WHITE_LABEL = {
    "companyName": "SeptiVolt",
    "industry": "Solar"
}

def clean_text(text):
    if not text: return ""
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    # Interpolate White Label variables
    text = text.replace("${WHITE_LABEL.companyName}", WHITE_LABEL["companyName"])
    text = text.replace("${WHITE_LABEL.industry}", WHITE_LABEL["industry"])
    text = text.replace("${WHITE_LABEL.industry.toLowerCase()}", WHITE_LABEL["industry"].lower())
    return text

def estimate_es_characters():
    modules_es_path = Path("frontend/lib/modules_es.ts")
    if not modules_es_path.exists():
        print(f"Error: {modules_es_path} not found")
        return

    content = modules_es_path.read_text(encoding="utf-8")
    
    # Very rough regex to extract module blocks
    # We look for "mod_X_Y": { ... sections: [ ... ] }
    module_blocks = re.findall(r'"(mod_\d+_\w+)":\s*\{.*?\bsections:\s*\[(.*?)\n\s*\]', content, re.DOTALL)
    
    total_chars = 0
    module_count = 0
    
    print(f"{'Module ID':<15} | {'Intro':<10} | {'Segments':<10} | {'Transition':<10} | {'Total':<10}")
    print("-" * 65)

    for mod_id, sections_block in module_blocks:
        module_count += 1
        
        # Extract title (rough)
        title_match = re.search(r'title:\s*["`](.*?)["`]', content[content.find(mod_id):])
        mod_title = title_match.group(1) if title_match else mod_id
        
        # Extract individual section contents
        # Sections usually look like { title: "...", type: "...", content: "..." }
        section_contents = re.findall(r'content:\s*["`](.*?)["`]', sections_block, re.DOTALL)
        
        # 1. Intro Section
        # logic: "Welcome to {title}. {overview}" (where overview is first content)
        overview = clean_text(section_contents[0]) if section_contents else ""
        intro_text = f"Bienvenido al {mod_title}. {overview}"
        intro_chars = len(intro_text)
        
        # 2. Instructional Segments
        # logic: each section content
        segment_chars = sum(len(clean_text(c)) for c in section_contents)
        
        # 3. Transition Section
        # logic: "Complete the knowledge check..."
        transition_text = "Completa la verificación de conocimientos y luego inicia el escenario de simulación. Enfócate en un descubrimiento claro, un encuadre conciso y un lenguaje de próximos pasos seguro."
        transition_chars = len(transition_text)
        
        mod_total = intro_chars + segment_chars + transition_chars
        total_chars += mod_total
        
        print(f"{mod_id:<15} | {intro_chars:<10} | {segment_chars:<10} | {transition_chars:<10} | {mod_total:<10}")

    print("-" * 65)
    print(f"Total Modules: {module_count}")
    print(f"Estimated Spanish Characters: {total_chars:,}")
    print(f"Current Balance: 131,000")
    if total_chars > 131000:
        print(f"DEFICIT: {total_chars - 131000:,} characters")
    else:
        print(f"SURPLUS: {131000 - total_chars:,} characters")

if __name__ == "__main__":
    estimate_es_characters()
