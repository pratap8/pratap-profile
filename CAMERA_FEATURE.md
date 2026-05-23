# Camera Random Capture Feature

## Overview
The camera module provides an advanced photo capture functionality with a unique **random capture mode** that is not available in standard camera applications.

## Features

### 1. Standard Camera Controls
- **Start Camera**: Activates the camera and displays live video feed
- **Capture Now**: Instantly capture a single photo from the live video stream
- **Stop Camera**: Closes the camera stream and releases hardware resources

### 2. Random Capture Mode (Advanced Feature)
This is the unique feature of this camera implementation:

#### What It Does
- Automatically captures photos at **unpredictable intervals**
- Each photo is captured between **1 to 6 seconds** (randomly determined)
- Continues capturing photos consecutively without user intervention
- Perfect for candid shots and spontaneous moments

#### How It Works
1. Click **"Start Random Capture"** button to begin the random capture sequence
2. A countdown timer displays when the next photo will be captured
3. Photos are automatically downloaded as they are captured
4. The process repeats continuously until you stop it

#### Stopping the Feature
- **"Stop Random Capture"**: Halts the automatic capturing but keeps the camera active
- **"Stop Camera"**: Stops both the camera and any active capturing

## Technical Specifications

### Random Timing Algorithm
- **Minimum delay**: 1 second
- **Maximum delay**: 6 seconds
- **Randomization**: Truly random calculation for each capture interval
- **Delay between shots**: 500ms buffer for system processing

### Photo Storage
- Photos are automatically downloaded to your default download folder
- Filename format: `captured-photo-[timestamp].png`
- Format: PNG (lossless quality)

### Video Properties
- **Resolution**: 1280x720 (ideal)
- **Mirror effect**: Applied (horizontally flipped for selfie perspective)
- **Audio**: Disabled
- **Device**: Front-facing camera (selfie mode)

## Use Cases

1. **Candid Photography**: Capture spontaneous moments without planning exact timing
2. **Batch Photo Sessions**: Quickly collect multiple photos in a short time
3. **Surprise Shots**: The randomness adds an element of surprise and creativity
4. **Photo Booth Simulation**: Creates an automated photo booth experience

## Tips & Best Practices

- **Preparation**: Position yourself in frame before starting random capture
- **Lighting**: Ensure good lighting for better photo quality
- **Frequency**: Photos captured every 1-6 seconds may result in very similar shots
- **Storage**: Monitor disk space if capturing many photos in succession
- **Browser Permissions**: Grant camera permissions for the feature to work

## Difference from Standard Cameras

| Feature | Standard Camera | This Implementation |
|---------|-----------------|-------------------|
| Single Shot | ✓ | ✓ |
| Manual Timing | ✓ | ✓ |
| Random Auto Capture | ✗ | ✓ |
| Continuous Batches | ✗ | ✓ |
| Preset Intervals | Sometimes | Random (1-6s) |

---

**Version**: 1.0  
**Last Updated**: May 2026
