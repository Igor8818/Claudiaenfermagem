Add-Type -AssemblyName System.Drawing

$src = [System.Drawing.Bitmap]::FromFile("$PSScriptRoot\..\images\instagram\embed_photo_1.jpg")

Write-Host "--- Scanning Y=300 (upper area) ---"
for ($x = 0; $x -lt $src.Width; $x += 100) {
    $p = $src.GetPixel($x, 300)
    Write-Host "X=$x : R=$($p.R) G=$($p.G) B=$($p.B)"
}

Write-Host "`n--- Scanning Y=700 (middle area) ---"
for ($x = 0; $x -lt $src.Width; $x += 100) {
    $p = $src.GetPixel($x, 700)
    Write-Host "X=$x : R=$($p.R) G=$($p.G) B=$($p.B)"
}

Write-Host "`n--- Scanning Y=1100 (lower area) ---"
for ($x = 0; $x -lt $src.Width; $x += 100) {
    $p = $src.GetPixel($x, 1100)
    Write-Host "X=$x : R=$($p.R) G=$($p.G) B=$($p.B)"
}

$src.Dispose()
