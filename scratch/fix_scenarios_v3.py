import sys
import re

def fix_scenarios(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    new_lines = []
    for line in lines:
        stripped = line.strip()
        # Detect if the line is likely a string property delimited by backticks
        # Example: opening_line: `...`,
        if (": `" in line or "= `" in line) and (stripped.endswith("`,") or stripped.endswith("`")):
            # Find the first and last backtick
            start_idx = line.find("`")
            end_idx = line.rfind("`")
            
            if start_idx != -1 and end_idx != -1 and start_idx != end_idx:
                prefix = line[:start_idx + 1]
                body = line[start_idx + 1:end_idx]
                suffix = line[end_idx:]
                
                # Replace internal backticks in body, preserving ${...}
                new_body = ""
                i = 0
                while i < len(body):
                    if body[i:i+2] == "${":
                        close_brace = body.find("}", i)
                        if close_brace != -1:
                            new_body += body[i:close_brace+1]
                            i = close_brace + 1
                            continue
                    if body[i] == "`":
                        new_body += "'"
                    else:
                        new_body += body[i]
                    i += 1
                
                new_lines.append(prefix + new_body + suffix)
            else:
                new_lines.append(line)
        elif '": `' in line: # For keys that are template literals
             # Handle keys like `${INDUSTRY.toLowerCase()}_sam`: {
             # These shouldn't have internal backticks usually, but let's be safe.
             new_lines.append(line)
        else:
            # For double quoted strings, also check for backticks
            if '"' in line:
                # Replace any ` with '
                new_lines.append(line.replace("`", "'"))
            else:
                new_lines.append(line)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    
    print("Scenarios global fix complete.")

if __name__ == "__main__":
    fix_scenarios(sys.argv[1])
