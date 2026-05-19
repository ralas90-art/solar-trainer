$files = Get-ChildItem "c:\Users\12132\Desktop\Antigravity Solar Sales Trainer Agent\AntiGravity Doc\.tmp\*.html" -Recurse
foreach ($file in $files) {
    $content = Get-Content $file.FullName
    if ($content -notmatch "box-sizing: border-box") {
        $content = $content -replace "<style>", "<style>`n    * { box-sizing: border-box; }"
        Set-Content $file.FullName $content
        Write-Host "Fixed $($file.Name)"
    }
}
