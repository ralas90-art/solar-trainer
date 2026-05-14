import hashlib
import os

def get_md5(file_path):
    hash_md5 = hashlib.md5()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()

pairs = [
    (
        r"C:\Users\12132\Desktop\Antigravity Solar Sales Trainer Agent\MASTER_CURRICULUM_PACK_V2_UNIFIED.md",
        r"C:\Users\12132\Desktop\Antigravity Solar Sales Trainer Agent\SeptiVolt_Delivery\EN\Curriculum\MASTER_CURRICULUM_PACK_V2_UNIFIED.md"
    ),
    (
        r"C:\Users\12132\Desktop\Antigravity Solar Sales Trainer Agent\transcripts\v2\en\ElevenLabs_Production_Manifest.json",
        r"C:\Users\12132\Desktop\Antigravity Solar Sales Trainer Agent\SeptiVolt_Delivery\EN\ElevenLabs_Transcripts\ElevenLabs_Production_Manifest.json"
    ),
    (
        r"C:\Users\12132\Desktop\Antigravity Solar Sales Trainer Agent\transcripts\v2\en\ElevenLabs_Transcripts_V2_Modules.md",
        r"C:\Users\12132\Desktop\Antigravity Solar Sales Trainer Agent\SeptiVolt_Delivery\EN\ElevenLabs_Transcripts\ElevenLabs_Transcripts_V2_Modules.md"
    )
]

for p1, p2 in pairs:
    if os.path.exists(p1) and os.path.exists(p2):
        md5_1 = get_md5(p1)
        md5_2 = get_md5(p2)
        print(f"File 1: {os.path.basename(p1)} | MD5: {md5_1}")
        print(f"File 2: {os.path.basename(p2)} | MD5: {md5_2}")
        print(f"Match: {md5_1 == md5_2}")
        print("-" * 20)
    else:
        print(f"Missing file: {p1 if not os.path.exists(p1) else p2}")
