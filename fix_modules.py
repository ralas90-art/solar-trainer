import sys

with open('frontend/lib/modules.ts', 'r', encoding='utf-8') as f:
    content = f.read()

marker1 = '    // ─── MODULE 1.5A — Utility Bills & Net Metering ─────────────────────────────'
marker2 = '// Map scenarios back to their primary module for "Resume Training" logic\nexport const SCENARIO_TO_MODULE'

if marker1 in content and marker2 in content:
    part1, rest = content.split(marker1, 1)
    part2, part3 = rest.split(marker2, 1)
    
    stray_modules = marker1 + part2
    
    # We need to insert stray_modules right before `\n}\n// Each module has an ordered list of scenarios`
    target = '}\n// Each module has an ordered list of scenarios'
    if target in part1:
        # replace the LAST occurrence of `}` just to be safe
        idx = part1.rfind(target)
        new_part1 = part1[:idx] + ',\n' + stray_modules + part1[idx:]
        
        final_content = new_part1 + marker2 + part3
        with open('frontend/lib/modules.ts', 'w', encoding='utf-8') as f:
            f.write(final_content)
        print('Fixed successfully')
    else:
        print('Target not found')
else:
    print('Markers not found')
