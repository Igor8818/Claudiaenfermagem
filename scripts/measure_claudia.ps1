Add-Type -AssemblyName System.Drawing

$img = [System.Drawing.Bitmap]::FromFile("$PSScriptRoot\..\images\instagram\embed_photo_1.jpg")
$bgR = 234; $bgG = 229; $bgB = 225

# Let's check vertical bounds in Claudia's column (e.g. x from 450 to 1050)
$minY = $img.Height; $maxY = 0
for ($y = 0; $y -lt $img.Height; $y += 5) {
    for ($x = 450; $x -lt 1050; $x += 10) {
        $p = $img.GetPixel($x, $y)
        $diff = [Math]::Abs($p.R - $bgR) + [Math]::Abs($p.G - $bgG) + [Math]::Abs($p.B - $bgB)
        if ($diff -gt 35) {
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "Claudia vertical span: Y=$minY to Y=$maxY (Height: $($maxY - $minY))"

# Let's find horizontal center of Claudia between Y=$minY+100 and Y=$minY+500 (head & shoulders)
$sumX = 0; $count = 0
for ($y = $minY; $y -lt ($minY + 400); $y += 5) {
    for ($x = 400; $x -lt 1080; $x += 5) {
        $p = $img.GetPixel($x, $y)
        $diff = [Math]::Abs($p.R - $bgR) + [Math]::Abs($p.G - $bgG) + [Math]::Abs($p.B - $bgB)
        if ($diff -gt 35) {
            $sumX += $x
            $count++
        }
    }
}
$avgX = [int]($sumX / $count)
Write-Host "Claudia center around head/shoulders: X=$avgX"

$img.Dispose()
