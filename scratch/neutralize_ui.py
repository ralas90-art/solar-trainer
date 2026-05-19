import os
import re

# Class and variable mappings for neutralization
MAPPINGS = {
    "btn-solar": "btn-primary",
    "btn-outline-solar": "btn-outline-primary",
    "bg-solar": "bg-primary",
    "text-solar": "text-primary",
    "border-solar": "border-primary",
    "badge-solar": "badge-primary",
    "solar-glow": "brand-glow",
    "solar-glow-strong": "brand-glow-strong",
    "animate-solar-pulse": "animate-brand-pulse",
    "solarPulse": "brandPulse",
    "solar: \"btn-solar\"": "primary: \"btn-primary\"",
    "--solar-orange": "--brand-primary",
    "--solar-orange-dim": "--brand-primary-dim",
    "--solar-orange-glow": "--brand-primary-glow",
    "--solar-amber": "--brand-accent",
    "--solar-amber-dim": "--brand-accent-dim",
    "var(--solar-orange)": "var(--brand-primary)",
    "var(--solar-amber)": "var(--brand-accent)"
}

TARGET_DIR = r"c:\Users\12132\Desktop\Antigravity Solar Sales Trainer Agent\frontend"
EXCLUDE_DIRS = {".next", "node_modules", ".git", ".vercel"}

def process_file(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except UnicodeDecodeError:
        # Skip binary files or different encodings if any
        return

    modified = False
    new_content = content
    for old, new in MAPPINGS.items():
        if old in new_content:
            new_content = new_content.replace(old, new)
            modified = True
            
    if modified:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Neutralized: {file_path}")

def main():
    for root, dirs, files in os.walk(TARGET_DIR):
        # Exclude directories
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        for file in files:
            if file.endswith((".tsx", ".ts", ".css", ".js", ".json")):
                process_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
