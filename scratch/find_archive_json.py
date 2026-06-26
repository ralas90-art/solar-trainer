import os

def main():
    root_dir = "_Archive_Legacy"
    found_files = []
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if "MASTER_CURRICULUM" in file or "Curriculum" in file or "ES" in file or "transcript" in file.lower() or file.endswith(".md"):
                found_files.append(os.path.join(root, file))
    
    print(f"Found {len(found_files)} potential files:")
    for f in sorted(found_files)[:30]:
        print(f"  {f}")
    if len(found_files) > 30:
        print(f"  ... and {len(found_files) - 30} more")

if __name__ == '__main__':
    main()
