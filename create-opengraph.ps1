Add-Type -AssemblyName System.Drawing

# Define paths
$sourcePath = "c:\Users\shudi\Desktop\ssss\Circuit-Crafters-Raw-File\iot-folio-spark-main\iot-folio-spark-main\src\assets\Only Logo.png"
$outputPath = "c:\Users\shudi\Desktop\ssss\Circuit-Crafters-Raw-File\iot-folio-spark-main\iot-folio-spark-main\public\opengraph-image.png"

# Load the source image
$sourceImage = [System.Drawing.Image]::FromFile($sourcePath)
Write-Host "Source image loaded. Size: $($sourceImage.Width)x$($sourceImage.Height)"

# Create a new blank image with the desired dimensions (1200x630)
$targetWidth = 1200
$targetHeight = 630
$targetImage = New-Object System.Drawing.Bitmap($targetWidth, $targetHeight)

# Create graphics object for drawing
$graphics = [System.Drawing.Graphics]::FromImage($targetImage)

# Set background color to white
$graphics.Clear([System.Drawing.Color]::White)

# Calculate resize dimensions while preserving aspect ratio
$sourceAspect = $sourceImage.Width / $sourceImage.Height
$targetAspect = $targetWidth / $targetHeight

$resizedWidth = $targetWidth * 0.85  # Use 85% of the target width
$resizedHeight = $resizedWidth / $sourceAspect

# If the height is too big, scale based on height instead
if ($resizedHeight -gt ($targetHeight * 0.85)) {
    $resizedHeight = $targetHeight * 0.85
    $resizedWidth = $resizedHeight * $sourceAspect
}

# Calculate position to center the image
$posX = ($targetWidth - $resizedWidth) / 2
$posY = ($targetHeight - $resizedHeight) / 2

# Draw the resized logo on the target canvas
$destRect = New-Object System.Drawing.RectangleF($posX, $posY, $resizedWidth, $resizedHeight)
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.DrawImage($sourceImage, $destRect)

# Save the result
$targetImage.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)

# Clean up
$graphics.Dispose()
$targetImage.Dispose()
$sourceImage.Dispose()

Write-Host "Created Open Graph image at: $outputPath"