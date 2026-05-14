import sys

def fix_lines(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Line 207 (0-indexed 206)
    # Target: briefing: `Goal: Turn an existing ${INDUSTRY.toLowerCase()} customer into a referral or upsell opportunity.\n\nKey Concepts:\n1. Don`t leave — warm lead for referrals and battery upsell.\n2. Check satisfaction, then referral ask.\n3. Orphan owner check: 'Is your original rep still around?` \n\nTip: Existing ${INDUSTRY.toLowerCase()} homes are the easiest referral sources if you lead with service.`,
    line_207 = lines[206]
    line_207 = line_207.replace("Don`t", "Don't")
    line_207 = line_207.replace("around?` ", "around?' ")
    lines[206] = line_207

    # Line 216 (0-indexed 215)
    # Target: briefing: `Goal: Educate without confronting her loyalty to the utility.\n\nKey Concepts:\n1. Do NOT attack the utility.\n2. 'Have you noticed your rates changing over time?` \n3. Position ${INDUSTRY.toLowerCase()} as complementary: `You keep the utility as backup.'\n\nTip: `${INDUSTRY} just means you're not 100% dependent on their prices anymore.'`,
    line_216 = lines[215]
    line_216 = line_216.replace("time?` ", "time?' ")
    line_216 = line_216.replace("complementary: `", "complementary: '")
    line_216 = line_216.replace("Tip: `$", "Tip: '$")
    lines[215] = line_216

    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    
    print("Specific lines fixed.")

if __name__ == "__main__":
    fix_lines(sys.argv[1])
