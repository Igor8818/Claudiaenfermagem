Add-Type -AssemblyName System.Drawing

$img = [System.Drawing.Bitmap]::FromFile("$PSScriptRoot\..\images\instagram\embed_photo_1.jpg")
$bgR = 234; $bgG = 229; $bgB = 225

# Let's find bounding box of non-background pixels (diff > 25)
$minX = $img.Width; $maxX = 0
$minY = $img.Height; $maxY = 0

for ($y = 0; $y -lt $img.Height; $y += 10) {
    for ($x = 0; $x -lt $img.Width; $x += 10) {
        $p = $img.GetPixel($x, $y)
        $diff = [Math]::Abs($p.R - $bgR) + [Math]::Abs($p.G - $bgG) + [Math]::Abs($p.B - $bgB)
        if ($diff -gt 35) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "Non-background bounding box:"
Write-Host "X: $minX to $maxX (width: $($maxX - $minX))"
Write-Host "Y: $minY to $maxY (height: $($maxY - $minY))"

# Let's check if there's anything on the left side vs right side
# E.g. Check bounding box in Left Half (x < 500) and Right Half (x > 500)
$leftPixels = 0
$rightPixels = 0
for ($y = 0; $y -lt $img.Height; $y += 10) {
    for ($x = 0; $x -lt 500; $x += 10) {
        $p = $img.GetPixel($x, $y)
        $diff = [Math]::Abs($p.R - $bgR) + [Math]::Abs($p.G - $bgG) + [Math]::Abs($p.B - $bgB)
        if ($diff -gt 35) { $leftPixels++ }
    }
    for ($x = 500; $x -lt $img.Width; $x += 10) {
        $p = $img.GetPixel($x, $y)
        $diff = [Math]::Abs($p.R - $bgR) + [Math]::Abs($p.G - $bgG) + [Math]::Abs($p.B - $bgB)
        if ($diff -gt 35) { $rightPixels++ }
    }
}

Write-Host "Left non-bg samples: $leftPixels, Right non-bg samples: $rightPixels"
$img.Dispose()
