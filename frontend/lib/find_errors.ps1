$content = Get-Content "C:\Users\12132\Desktop\Antigravity Solar Sales Trainer Agent\solar-trainer\frontend\lib\modules_es.ts"
for ($i = 0; $i -lt $content.Count; $i++) {
    if ($content[$i] -match "workbookPrompts: \[") {
        $found = $false
        for ($j = $i + 1; $j -lt [Math]::Min($i + 50, $content.Count); $j++) {
            if ($content[$j] -match "^\s*\]") {
                $found = $true
                break
            }
        }
        if (-not $found) {
            Write-Host "Potential error at line $($i + 1)"
        }
    }
}
