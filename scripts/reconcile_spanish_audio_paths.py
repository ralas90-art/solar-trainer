import json
import argparse
import shutil
from pathlib import Path
import sys

# Force UTF-8
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except AttributeError:
        pass

# Import curriculum parser from audit script
sys.path.append(str(Path(__file__).parent.parent / "scratch"))
try:
    from audio_inventory_audit import parse_ts_curriculum, get_expected_sections
except ImportError:
    # Inline fallback definition if run outside repository context
    def parse_ts_curriculum(file_path):
        return {}
    def get_expected_sections(module_id, sections, is_spanish):
        return []

def reconcile(dry_run=True, force=False):
    print(f"=== SPANISH PATH RECONCILIATION AUDIT (DRY RUN: {dry_run}) ===")
    
    modules_ts = Path("frontend/lib/modules.ts")
    modules_es_ts = Path("frontend/lib/modules.es.ts")
    
    if not modules_ts.exists() or not modules_es_ts.exists():
        print("[ERROR] Curriculum TypeScript files not found.")
        return
        
    es_modules = parse_ts_curriculum(str(modules_es_ts))
    
    migrated_count = 0
    skipped_count = 0
    missing_old_count = 0
    zero_byte_count = 0
    
    reconciliation_map = []
    
    for mod_id, es_mod in sorted(es_modules.items()):
        is_fallback = es_mod.get("isTextFallback", True)
        if is_fallback:
            continue
            
        sections = es_mod.get("sections", [])
        expected_section_ids = get_expected_sections(mod_id, sections, True)
        
        for idx, sec_id in enumerate(expected_section_ids):
            target_file = Path(f"frontend/public/audio/modules/{mod_id}/{sec_id}_es.mp3")
            old_file = Path(f"frontend/public/audio/modules/es/{mod_id}/section_{idx + 1}.mp3")
            
            if old_file.exists():
                size = old_file.stat().st_size
                if size == 0:
                    print(f"[WARN] Zero-byte file found in old path: {old_file}")
                    zero_byte_count += 1
                    continue
                    
                if target_file.exists() and not force:
                    print(f"[SKIP] Target file already exists: {target_file}")
                    skipped_count += 1
                else:
                    reconciliation_map.append((old_file, target_file))
            else:
                missing_old_count += 1
                
    if not reconciliation_map:
        print("\n[INFO] No Spanish audio files found in old path format. Nothing to migrate.")
        print(f"Stats: Skipped (already in target): {skipped_count} | Zero-byte: {zero_byte_count} | Missing old files: {missing_old_count}")
        return
        
    print(f"\nFound {len(reconciliation_map)} files that can be migrated:")
    for src, dst in reconciliation_map:
        print(f"  - Copy: {src} -> {dst}")
        
    if dry_run:
        print("\n[INFO] Dry run completed. No files were moved or copied.")
        return
        
    # Execute migration
    print("\nExecuting migration...")
    for src, dst in reconciliation_map:
        try:
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dst)
            print(f"  [SUCCESS] Copied {src.name} to {dst}")
            migrated_count += 1
        except Exception as e:
            print(f"  [FAIL] Failed to copy {src.name}: {e}")
            
    print(f"\nMigration Complete! Successfully migrated {migrated_count} of {len(reconciliation_map)} files.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Reconcile Spanish Audio Paths")
    parser.add_argument("--execute", action="store_true", help="Execute the copy operation (default is dry-run)")
    parser.add_argument("--force", action="store_true", help="Overwrite existing files in target destination")
    
    args = parser.parse_args()
    reconcile(dry_run=not args.execute, force=args.force)
