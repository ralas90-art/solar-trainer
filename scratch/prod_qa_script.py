import urllib.request
import urllib.error

base_url = "https://solar-trainer.vercel.app"

audio_files = [
    "/audio/modules/mod_1_1/mod_1_1_intro.mp3",
    "/audio/modules/mod_2_1/mod_2_1_intro.mp3",
    "/audio/modules/mod_3_3/mod_3_3_segment_1.mp3",
    "/audio/modules/mod_4_4/mod_4_4_segment_1.mp3",
    "/audio/modules/mod_5_2/mod_5_2_segment_1.mp3",
    "/audio/modules/mod_6_5/mod_6_5_segment_1.mp3",
    "/audio/modules/mod_7_9/mod_7_9_transition.mp3"
]

print("Checking audio files on production...")
for file in audio_files:
    url = base_url + file
    try:
        req = urllib.request.Request(url, method='HEAD')
        with urllib.request.urlopen(req) as response:
            print(f"[OK] {file} - Status: {response.status} - Size: {response.getheader('Content-Length')}")
    except urllib.error.HTTPError as e:
        print(f"[ERROR] {file} - Status: {e.code}")
    except Exception as e:
        print(f"[ERROR] {file} - {str(e)}")
