Add-Type -AssemblyName System.Drawing

$inputPath = "c:\Users\igor\claudiaenf\images\instagram\post_5.jpg"
$src = [System.Drawing.Image]::FromFile($inputPath)

Write-Host "post_5 Dimensions: $($src.Width)x$($src.Height)"

# In post_5.jpg (360x640):
# Her head and shoulders start at top and end before the play button (which starts at y ~ 260)
# Let's crop from x = 10, y = 10, w = 340, h = 260 or h = 280
$crops = @(
    @{ name = "claudia-clinic-portrait.jpg"; x = 40; y = 30; w = 280; h = 240 },
    @{ name = "claudia-clinic-half.jpg"; x = 20; y = 20; w = 320; h = 260 }
)

foreach ($c in $crops) {
    $out = "c:\Users\igor\claudiaenf\images\" + $c.name
    $rect = New-Object System.Drawing.Rectangle($c.x, $c.y, $c.w, $c.h)
    $bmp = New-Object System.Drawing.Bitmap($c.w, $c.h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($src, (New-Object System.Drawing.Rectangle(0, 0, $c.w, $c.h)), $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Saved $($c.name)"
}

$src.Dispose()
