# Play a system sound to notify the user
$SoundFile = 'C:\Windows\Media\notify.wav'
if (Test-Path $SoundFile) {
    echo "Playing sound: $SoundFile"
    $SoundInfo = New-Object System.Media.SoundPlayer
    $SoundInfo.SoundLocation = $SoundFile
    $SoundInfo.PlaySync()
} else {
    echo "Sound file not found: $SoundFile"
}
