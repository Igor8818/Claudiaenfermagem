Add-Type -AssemblyName System.Drawing

$files = @("embed_photo_8.jpg", "embed_photo_3.jpg", "embed_photo_9.jpg", "embed_photo_4.jpg", "embed_photo_10.jpg", "post_1.jpg", "post_6.jpg")

foreach ($f in $files) {
    $p = "$PSScriptRoot\..\images\instagram\$f"
    if (Test-Path $p) {
        $img = [System.Drawing.Bitmap]::FromFile($p)
        Write-Host "$f : $($img.Width)x$($img.Height)"
        $img.Dispose()
    }
}
