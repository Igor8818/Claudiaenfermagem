Add-Type -AssemblyName System.Drawing

$orig = [System.Drawing.Bitmap]::FromFile("$PSScriptRoot\..\images\instagram\embed_photo_1.jpg")

Write-Host "Checking Y=350 to Y=460 in original embed_photo_1:"
for ($y = 350; $y -le 460; $y += 10) {
    # Find leftmost pixel that is skin tone or dark dress/strap
    $found = "None"
    for ($x = 400; $x -le 700; $x += 5) {
        $p = $orig.GetPixel($x, $y)
        # Check if not teal (teal is around R=30-70, G=150-185, B=150-185)
        $isTeal = ($p.G -gt 140 -and $p.B -gt 140 -and $p.R -lt 100)
        # Check if not beige bg (R>220, G>215, B>210)
        $isBg = ($p.R -gt 220 -and $p.G -gt 215 -and $p.B -gt 210)
        if (-not $isTeal -and -not $isBg) {
            $found = "X=$x (R=$($p.R) G=$($p.G) B=$($p.B))"
            break
        }
    }
    Write-Host "Y=$y : First subject pixel at $found"
}

$orig.Dispose()
