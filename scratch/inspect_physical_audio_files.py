from pathlib import Path
import sys

def inspect_physical_files():
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
        
    modules_dir = Path(r"c:\Users\12132\Desktop\Antigravity Solar Sales Trainer Agent\frontend\public\audio\modules")
    if not modules_dir.exists():
        print("modules dir does not exist.")
        return
        
    print(f"Modules base path: {modules_dir}")
    
    subdirs = sorted([d for d in modules_dir.iterdir() if d.is_dir()])
    print(f"Total module subdirectories: {len(subdirs)}")
    
    # Let's count files in each subdirectory
    for idx, subdir in enumerate(subdirs):
        files = sorted([f for f in subdir.iterdir() if f.is_file()])
        if subdir.name == "es":
            print(f"[DIR] es/ (Spanish modules subdirectory)")
            es_subdirs = sorted([d for d in subdir.iterdir() if d.is_dir()])
            print(f"  Total Spanish subdirectories: {len(es_subdirs)}")
            for es_sub in es_subdirs[:10]:
                es_files = sorted([f for f in es_sub.iterdir() if f.is_file()])
                print(f"    - {es_sub.name}: {len(es_files)} files (e.g., {', '.join([f.name for f in es_files[:3]])})")
            if len(es_subdirs) > 10:
                print(f"    - ... and {len(es_subdirs) - 10} more directories")
        else:
            print(f"  - {subdir.name}: {len(files)} files (e.g., {', '.join([f.name for f in files[:3]])})")

if __name__ == "__main__":
    inspect_physical_files()
