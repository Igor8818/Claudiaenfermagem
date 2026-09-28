Add-Type -AssemblyName System.Drawing

$inputPath = "c:\Users\igor\claudiaenf\images\instagram\post_5.jpg"
$outputPath = "c:\Users\igor\claudiaenf\images\claudia-consultorio-limpo.jpg"

$src = [System.Drawing.Bitmap]::FromFile($inputPath)
$g = [System.Drawing.Graphics]::FromImage($src)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

# Create a rounded rectangle path for the white card
# Left: 58, Top: 250, Width: 244, Height: 220, Radius: 28
$rect = New-Object System.Drawing.Rectangle(58, 252, 244, 218)
$radius = 28
$diameter = $radius * 2

$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$path.AddArc($rect.X, $rect.Y, $diameter, $diameter, 180, 90)
$path.AddArc($rect.Right - $diameter, $rect.Y, $diameter, $diameter, 270, 90)
$path.AddLine($rect.Right, $rect.Y + $radius, $rect.Right, $rect.Bottom)
$path.AddLine($rect.Right, $rect.Bottom, $rect.X, $rect.Bottom)
$path.AddLine($rect.X, $rect.Bottom, $rect.X, $rect.Y + $radius)
$path.CloseFigure()

$cardBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$g.FillPath($cardBrush, $path)

# Draw subtle border
$borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(230, 240, 240), 1.5)
$g.DrawPath($borderPen, $path)

# Colors
$tealBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(13, 148, 136)) # #0D9488
$purpleBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(139, 92, 246)) # #8B5CF6
$darkBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(30, 41, 59))

$fontTitle = New-Object System.Drawing.Font("Georgia", 17, [System.Drawing.FontStyle]::Bold)
$fontSub = New-Object System.Drawing.Font("Arial", 8.5, [System.Drawing.FontStyle]::Bold)
$fontLoc = New-Object System.Drawing.Font("Arial", 8.5, [System.Drawing.FontStyle]::Regular)

$stringFormat = New-Object System.Drawing.StringFormat
$stringFormat.Alignment = [System.Drawing.StringAlignment]::Center

# Draw Foot icon in teal
$penTeal = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(13, 148, 136), 4.0)
$penTeal.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$penTeal.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

# Foot curve
$g.DrawBezier($penTeal, 180, 275, 160, 290, 160, 315, 180, 330)
$g.DrawBezier($penTeal, 180, 330, 188, 338, 186, 348, 172, 355)

# Toes
$g.FillEllipse($tealBrush, 182, 270, 7.5, 9.0)
$g.FillEllipse($tealBrush, 173, 275, 6.0, 6.0)
$g.FillEllipse($tealBrush, 165, 281, 5.0, 5.0)
$g.FillEllipse($tealBrush, 159, 288, 4.0, 4.0)

# Hand cupping in purple
$penPurple = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(139, 92, 246), 3.5)
$penPurple.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$penPurple.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$g.DrawBezier($penPurple, 150, 345, 165, 365, 195, 368, 210, 355)

# Name
$g.DrawString("Claudia Fontes", $fontTitle, $tealBrush, (New-Object System.Drawing.PointF(180, 375)), $stringFormat)
$g.DrawString("ENFERMAGEM ESPECIALIZADA", $fontSub, $darkBrush, (New-Object System.Drawing.PointF(180, 407)), $stringFormat)
$g.DrawString("Podologia & Laserterapia", $fontLoc, $purpleBrush, (New-Object System.Drawing.PointF(180, 424)), $stringFormat)

$src.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)

$path.Dispose()
$cardBrush.Dispose()
$borderPen.Dispose()
$tealBrush.Dispose()
$purpleBrush.Dispose()
$darkBrush.Dispose()
$penTeal.Dispose()
$penPurple.Dispose()
$fontTitle.Dispose()
$fontSub.Dispose()
$fontLoc.Dispose()
$g.Dispose()
$src.Dispose()

Write-Host "Perfect! Generated claudia-consultorio-limpo.jpg"
