import sys
import re

def fix_scenarios(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # The issue is internal backticks in strings that use backticks as delimiters.
    # We want to replace ` with ' when it's used as an apostrophe.
    # We can't just replace all ` because it's the delimiter.
    # However, we know the specific cases: I`ll, he`s, you`re, system`s, I`ve, What`s, Now I`m, internet`s, backend`s
    
    replacements = {
        "backend`s": "backend's",
        "I`ll": "I'll",
        "he`s": "he's",
        "you`re": "you're",
        "system`s": "system's",
        "I`ve": "I've",
        "What`s": "What's",
        "Now I`m": "Now I'm",
        "internet`s": "internet's"
    }

    for old, new in replacements.items():
        content = content.replace(old, new)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Scenarios cleanup complete.")

if __name__ == "__main__":
    fix_scenarios(sys.argv[1])
