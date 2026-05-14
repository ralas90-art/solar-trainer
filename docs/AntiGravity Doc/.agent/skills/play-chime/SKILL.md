---
name: play-completion-chime
description: Play a chime sound to notify the user of task completion
---

# Play Completion Chime

## Goal
Play a distinct "chime" sound to audibly notify the user that a task or long-running process has completed.

## Instructions
1. Run the `scripts/play_sound.ps1` script associated with this skill.
2. Verify no errors are output.

## Tools/Scripts
```powershell
./scripts/play_sound.ps1
```

## Failure Modes
- **File not found**: If the sound file is missing, the script will echo a warning. This is non-fatal but should be noted.
- **Audio disabled**: No sound will be heard, but the script should still exit continuously.

## Definition of Done
- The script executes with exit code 0.
- (Manual) The user hears the chime.
