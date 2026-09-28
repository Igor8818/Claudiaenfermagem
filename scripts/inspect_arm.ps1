Add-Type -AssemblyName System.Drawing

$orig = [System.Drawing.Bitmap]::FromFile("$PSScriptRoot\..\images\instagram\embed_photo_1.jpg")

Write-Host "--- Inspecting Y=330 in original embed_photo_1 ---"
for ($x = 350; $x -le 630; $x += 20) {
    $p = $orig.GetPixel($x, 330)
    Write-Host "X=$x : R=$($p.R) G=$($p.G) B=$($p.B)"
}

Write-Host "`n--- Inspecting Y=380 in original embed_photo_1 ---"
for ($x = 350; $x -le 630; $x += 20) {
    $p = $orig.GetPixel($x, 380)
    Write-Host "X=$x : R=$($p.R) G=$($p.G) B=$($p.B)"
}

Write-Host "`n--- Inspecting Y=440 in original embed_photo_1 ---"
for ($x = 350; $x -le 630; $x += 20) {
    $p = $orig.GetPixel($x, 440)
    Write-Host "X=$x : R=$($p.R) G=$($p.G) B=$($p.B)"
}

$orig.Dispose()
