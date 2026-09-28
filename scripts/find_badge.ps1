Add-Type -AssemblyName System.Drawing

$src = [System.Drawing.Bitmap]::FromFile("$PSScriptRoot\..\images\instagram\embed_photo_1.jpg")

# Find the exact rightmost column where teal badge exists (where R=37 G=161 B=161 or diff to teal < 30)
$tealR = 37; $tealG = 161; $tealB = 161
$badgeMinX = 2000; $badgeMaxX = 0
$badgeMinY = 2000; $badgeMaxY = 0

for ($y = 0; $y -lt $src.Height; $y += 2) {
    for ($x = 0; $x -lt 700; $x += 2) {
        $p = $src.GetPixel($x, $y)
        $diffTeal = [Math]::Abs($p.R - $tealR) + [Math]::Abs($p.G - $tealG) + [Math]::Abs($p.B - $tealB)
        if ($diffTeal -lt 45) {
            if ($x -lt $badgeMinX) { $badgeMinX = $x }
            if ($x -gt $badgeMaxX) { $badgeMaxX = $x }
            if ($y -lt $badgeMinY) { $badgeMinY = $y }
            if ($y -gt $badgeMaxY) { $badgeMaxY = $y }
        }
    }
}

Write-Host "Teal badge bounding box:"
Write-Host "X: $badgeMinX to $badgeMaxX (Width: $($badgeMaxX - $badgeMinX))"
Write-Host "Y: $badgeMinY to $badgeMaxY (Height: $($badgeMaxY - $badgeMinY))"

# Check what is between badgeMaxX and Claudia's left edge
Write-Host "`nPixels at Y=300 around badgeMaxX ($badgeMaxX):"
for ($x = ($badgeMaxX - 20); $x -le ($badgeMaxX + 60); $x += 5) {
    $p = $src.GetPixel($x, 300)
    Write-Host "X=$x : R=$($p.R) G=$($p.G) B=$($p.B)"
}

$src.Dispose()
