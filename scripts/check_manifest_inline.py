from pathlib import Path

f = Path('frontend/.next/static/chunks/9744-958e07951024505c.js')
txt = f.read_text(encoding='utf-8', errors='ignore')

# Search for how the manifest lookup is called
# The minified name for AUDIO_MANIFEST
# Look for 'mod_1_5' which would only appear if manifest is inlined
print("mod_1_5 in chunk:", 'mod_1_5' in txt)
print("mod_1_1 in chunk:", 'mod_1_1' in txt)

# Find the index
idx = txt.find('mod_1_5')
if idx >= 0:
    print("mod_1_5 found at:", idx)
    print("Snippet:", txt[max(0,idx-100):idx+200])
else:
    print("mod_1_5 NOT found - manifest is not inlined")
    
# Look for how the audio path is constructed - the _es.mp3 suffix
idx2 = txt.find('_es.mp3')
if idx2 >= 0:
    print("\n_es.mp3 found at:", idx2)
    print("Snippet:", txt[max(0,idx2-200):idx2+200])
else:
    print("\n_es.mp3 NOT found in chunk")
    
# Look for audio/modules path
idx3 = txt.find('audio/modules')
if idx3 >= 0:
    print("\naudio/modules found at:", idx3)
    print("Snippet:", txt[max(0,idx3-100):idx3+200])
