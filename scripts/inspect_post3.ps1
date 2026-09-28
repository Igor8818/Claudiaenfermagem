Add-Type -AssemblyName System.Drawing

$img = [System.Drawing.Bitmap]::FromFile("$PSScriptRoot\..\images\post3_1.jpg")
Write-Host "Width: $($img.Width) Height: $($img.Height)"
Write-Host "Top-Left (50,50): $($img.GetPixel(50, 50))"
Write-Host "Top-Right (1000,50): $($img.GetPixel(1000, 50))"
Write-Host "Center (540,675): $($img.GetPixel(540, 675))"
Write-Host "Bottom-Center (540,1200): $($img.GetPixel(540, 1200))"

# Check if there is skin tone
$skinSamples = 0
for ($y = 100; $y -lt 1200; $y += 20) {
    for ($x = 100; $x -lt 1000; $x += 20) {
        $p = $img.GetPixel($x, $y)
        if ($p.R -gt 180 -and $p.G -gt 130 -and $p.B -gt 100 -and $p.R -gt $p.G -and $p.G -gt $p.B) {
            $skinSamples++
        }
    }
}
Write-Host "Skin samples found: $skinSamples"

$img.Dispose()
