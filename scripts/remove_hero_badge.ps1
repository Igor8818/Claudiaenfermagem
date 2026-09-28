Add-Type -AssemblyName System.Drawing

$src = [System.Drawing.Bitmap]::FromFile("$PSScriptRoot\..\images\instagram\embed_photo_1.jpg")
$bmp = New-Object System.Drawing.Bitmap($src)

# Check colors around the badge:
# Top: Y=40, X from 50 to 620
# Left: X=30, Y from 50 to 500
# Bottom: Y=500, X from 50 to 620
# Right: X=635, Y from 50 to 500

$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

# The background color is R=234, G=229, B=225. Let's sample subtle variations:
# In fact, let's sample the exact background from X=10 to 630, Y=0 to 60, and Y=480 to 600
# Notice that a linear gradient from (0,0) [R=241, G=236, B=232] to (630, 480) [R=234, G=229, B=225] matches the studio light.

$rect = New-Object System.Drawing.Rectangle(0, 0, 626, 485)
$brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.PointF(0, 0)),
    (New-Object System.Drawing.PointF(630, 485)),
    [System.Drawing.Color]::FromArgb(241, 236, 232),
    [System.Drawing.Color]::FromArgb(234, 229, 225)
)

$g.FillRectangle($brush, $rect)

# Now smooth the seam around X=620-630 with surrounding pixels
for ($x = 615; $x -le 630; $x++) {
    $alpha = ($x - 615) / 15.0 # 0 at 615, 1 at 630
    for ($y = 0; $y -le 490; $y++) {
        $pOriginal = $src.GetPixel([Math]::Min($x + 8, $src.Width - 1), $y)
        $pDrawn = $bmp.GetPixel($x, $y)
        $r = [int]($pDrawn.R * (1 - $alpha) + $pOriginal.R * $alpha)
        $gCol = [int]($pDrawn.G * (1 - $alpha) + $pOriginal.G * $alpha)
        $b = [int]($pDrawn.B * (1 - $alpha) + $pOriginal.B * $alpha)
        $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $r, $gCol, $b))
    }
}

$outputPath = "$PSScriptRoot\..\images\claudia-hero-clean.jpg"
$bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
Copy-Item $outputPath "$PSScriptRoot\..\images\claudia-hero-hd.jpg" -Force

$brush.Dispose()
$g.Dispose()
$bmp.Dispose()
$src.Dispose()

Write-Host "SUCCESS: Generated claudia-hero-clean.jpg and updated claudia-hero-hd.jpg with NO BADGE!"
