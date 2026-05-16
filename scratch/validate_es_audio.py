import os
import json

def validate_es_audio():
    base_path = r"c:\Users\12132\Desktop\Antigravity Solar Sales Trainer Agent\frontend\public\audio\modules\es"
    modules = os.listdir(base_path)
    
    report = {
        "total_modules_found": len(modules),
        "modules_with_errors": [],
        "short_sections": [],
        "empty_files": []
    }
    
    for mod in modules:
        mod_path = os.path.join(base_path, mod)
        if not os.path.isdir(mod_path):
            continue
            
        files = os.listdir(mod_path)
        if not files:
            report["modules_with_errors"].append({"module": mod, "error": "No files found"})
            continue
            
        for f in files:
            if f.endswith(".mp3"):
                file_path = os.path.join(mod_path, f)
                size = os.path.getsize(file_path)
                if size == 0:
                    report["empty_files"].append({"module": mod, "file": f})
                
                # Check character count from log if possible, but here we can just check size
                # For short sections, we usually check the text length.
                # Since I don't have the text here, I'll rely on the log scan or just flag very small files (< 10KB)
                if size < 10000: # 10KB is roughly 1-2 seconds of audio
                    report["short_sections"].append({"module": mod, "file": f, "size": size})

    print(json.dumps(report, indent=2))

if __name__ == "__main__":
    validate_es_audio()
