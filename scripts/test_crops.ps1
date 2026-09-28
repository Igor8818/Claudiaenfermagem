Add-Type -AssemblyName System.Drawing

$inputPath = "c:\Users\igor\claudiaenf\images\instagram\post_4.jpg"
$src = [System.Drawing.Image]::FromFile($inputPath)

# Let's test a few crops:
# 1. From y=0, x=330, width=310, height=450
$crops = @(
    @{ name = "claudia-face-1.jpg"; x = 325; y = 0; w = 315; h = 640 },
    @{ name = "claudia-face-2.jpg"; x = 340; y = 0; w = 300; h = 500 },
    @{ name = "claudia-face-3.jpg"; x = 310; y = 0; w = 330; h = 640 }
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
