Add-Type -AssemblyName System.Drawing

$inputPath = "c:\Users\igor\claudiaenf\images\instagram\post_4.jpg"
$outputPath = "c:\Users\igor\claudiaenf\images\claudia-portrait.jpg"

$src = [System.Drawing.Image]::FromFile($inputPath)
Write-Host "Source Dimensions: $($src.Width)x$($src.Height)"

# In post_4.jpg (640x640):
# Claudia's portrait is located on the right side:
# From x = 320 to 640 (width 320), y = 30 to 590 (height 560)
$cropX = 320
$cropY = 30
$cropW = 320
$cropH = 560

$cropRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)
$bmp = New-Object System.Drawing.Bitmap($cropW, $cropH)
$graphics = [System.Drawing.Graphics]::FromImage($bmp)
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

$destRect = New-Object System.Drawing.Rectangle(0, 0, $cropW, $cropH)
$graphics.DrawImage($src, $destRect, $cropRect, [System.Drawing.GraphicsUnit]::Pixel)

$bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)

$graphics.Dispose()
$bmp.Dispose()
$src.Dispose()

Write-Host "Successfully cropped to $outputPath"
