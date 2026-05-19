import json

with open('scripts/modules_en.json', 'r', encoding='utf-16') as f:
    text = f.read()
    
if 'Γ' in text:
    print("Yes! modules_en.json literally contains the characters Γ, Ç, ö!")
    # Let's see some occurrences:
    idx = text.find('Γ')
    print("Occurrence context:")
    print(text[max(0, idx-50):min(len(text), idx+50)])
else:
    print("No! modules_en.json does not contain Γ. It must be a python decoding issue.")
