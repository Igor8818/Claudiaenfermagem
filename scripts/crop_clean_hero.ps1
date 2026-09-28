Add-Type -AssemblyName System.Drawing

$src = [System.Drawing.Bitmap]::FromFile("$PSScriptRoot\..\images\instagram\embed_photo_1.jpg")

# Let's inspect where the badge/text on the left ends.
# Let's check columns 350 to 450
for ($x = 350; $x -le 460; $x += 10) {
    $pixels = 0
    for ($y = 0; $y -lt $src.Height; $y += 5) {
        $p = $src.GetPixel($x, $y)
        $diff = [Math]::Abs($p.R - 234) + [Math]::Abs($p.G - 229) + [Math]::Abs($p.B - 225)
        if ($diff -gt 35) { $pixels++ }
    }
    Write-Host "X=$x non-bg pixel count: $pixels"
}

# Crop 1: Full height, X from 430 to 1080 (width 650, height 1350)
$cropRect1 = New-Object System.Drawing.Rectangle(430, 0, 650, 1350)
$bmp1 = New-Object System.Drawing.Bitmap(650, 1350)
$g1 = [System.Drawing.Graphics]::FromImage($bmp1)
$g1.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g1.DrawImage($src, (New-Object System.Drawing.Rectangle(0, 0, 650, 1350)), $cropRect1, [System.Drawing.GraphicsUnit]::Pixel)
$bmp1.Save("$PSScriptRoot\..\images\claudia-hero-studio.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$g1.Dispose()
$bmp1.Dispose()

# Crop 2: Balanced 3:4 Portrait (width 800, height 1066) centered on head/torso (e.g. Y from 0 to 1100, X from 380 to 1080 with padding)
$cropRect2 = New-Object System.Drawing.Rectangle(420, 0, 660, 880)
$bmp2 = New-Object System.Drawing.Bitmap(660, 880)
$g2 = [System.Drawing.Graphics]::FromImage($bmp2)
$g2.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g2.DrawImage($src, (New-Object System.Drawing.Rectangle(0, 0, 660, 880)), $cropRect2, [System.Drawing.GraphicsUnit]::Pixel)
$bmp2.Save("$PSScriptRoot\..\images\claudia-hero-portrait.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$g2.Dispose()
$bmp2.Dispose()

$src.Dispose()
Write-Host "Created claudia-hero-studio.jpg and claudia-hero-portrait.jpg"
