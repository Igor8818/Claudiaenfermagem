Add-Type -AssemblyName System.Drawing

$img = [System.Drawing.Bitmap]::FromFile("$PSScriptRoot\..\images\instagram\embed_photo_1.jpg")
$bgR = 234; $bgG = 229; $bgB = 225

# Let's inspect horizontal slices to see where the text/badge on the left ends and where Claudia starts
for ($x = 0; $x -lt $img.Width; $x += 40) {
    $nonBgCount = 0
    for ($y = 0; $y -lt $img.Height; $y += 20) {
        $p = $img.GetPixel($x, $y)
        $diff = [Math]::Abs($p.R - $bgR) + [Math]::Abs($p.G - $bgG) + [Math]::Abs($p.B - $bgB)
        if ($diff -gt 35) { $nonBgCount++ }
    }
    Write-Host "X=$x : $nonBgCount"
}

$img.Dispose()
