from pathlib import Path

chunks_dir = Path('frontend/.next/static/chunks')

# Search top-level numbered chunks
print("=== Top-level chunks with audio code ===")
for f in chunks_dir.glob('*.js'):
    txt = f.read_text(encoding='utf-8', errors='ignore')
    if 'isLanguageFallback' in txt or 'QO7Mfy7rwYLdxzo4Q3iD' in txt:
        print(f"  {f.name} ({f.stat().st_size} bytes)")

# Check the 9744 chunk specifically
f9744 = chunks_dir / '9744-958e07951024505c.js'
if f9744.exists():
    txt = f9744.read_text(encoding='utf-8', errors='ignore')
    print("\n=== 9744 chunk analysis ===")
    print(f"  AUDIO_MANIFEST: {'AUDIO_MANIFEST' in txt}")
    print(f"  checkManifest:  {'checkManifest' in txt}")
    print(f"  tryStaticAsset: {'tryStaticAsset' in txt}")
    print(f"  method HEAD:    {'method:\"HEAD\"' in txt}")
    print(f"  isLanguageFallback: {'isLanguageFallback' in txt}")
    print(f"  QO7Mfy7rwYLdxzo4Q3iD: {'QO7Mfy7rwYLdxzo4Q3iD' in txt}")
    print(f"  static_asset:   {'static_asset' in txt}")
    print(f"  speech_synthesis: {'speech_synthesis' in txt}")
    print(f"  size: {f9744.stat().st_size} bytes")
    
    # show snippet around isLanguageFallback
    idx = txt.find('isLanguageFallback')
    if idx >= 0:
        print(f"\n  Snippet at isLanguageFallback:")
        print("  " + txt[max(0,idx-150):idx+400])
    
    idx2 = txt.find('static_asset')
    if idx2 >= 0:
        print(f"\n  Snippet at static_asset:")
        print("  " + txt[max(0,idx2-150):idx2+400])
else:
    print("\n  9744 chunk not found")
