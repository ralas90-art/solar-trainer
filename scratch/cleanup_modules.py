import sys

def cleanup_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    new_lines = []
    skip_depth = 0
    in_legacy_block = False
    
    # 1. Fix mod_2_4 backtick typo in the first pass
    content = "".join(lines)
    content = content.replace('`mod_2_4":', '"mod_2_4":')
    lines = content.splitlines(keepends=True)

    for line in lines:
        if not in_legacy_block:
            # Check for start of legacy blocks
            stripped = line.strip()
            if stripped.startswith("workbookPrompts:") or stripped.startswith("quiz:"):
                in_legacy_block = True
                # Determine if it's an array or object
                if "[" in line:
                    open_char = "["
                    close_char = "]"
                else:
                    open_char = "{"
                    close_char = "}"
                
                # Count depth
                skip_depth = line.count(open_char) - line.count(close_char)
                if skip_depth == 0:
                    in_legacy_block = False
                continue
            else:
                new_lines.append(line)
        else:
            # We are inside a legacy block, count brackets/braces
            skip_depth += line.count(open_char) - line.count(close_char)
            if skip_depth <= 0:
                in_legacy_block = False
            continue

    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    
    print("Cleanup complete.")

if __name__ == "__main__":
    cleanup_file(sys.argv[1])
