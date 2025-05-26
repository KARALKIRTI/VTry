import os
import sys
import torch
import cv2
import numpy as np
from PIL import Image
from torchvision import transforms

# Add the U-2-Net directory to the system path
U2NET_PATH = r"D:\\VITON-HD-main\\U-2-Net"
sys.path.append(U2NET_PATH)

# Import the U2NET class after appending the path
from model.u2net import U2NET

# Read input and output directories from command-line arguments
if len(sys.argv) != 3:
    print("Usage: python generate_cloth_mask.py <input_dir> <output_dir>")
    sys.exit(1)

input_dir = sys.argv[1]
output_dir = sys.argv[2]

# Ensure the output directory exists
os.makedirs(output_dir, exist_ok=True)

# Define the path to the pre-trained model
MODEL_PATH = r"D:\\VITON-HD-main\\models\\u2net (1).pth"

# Load the U2-Net model
def load_model():
    print("Loading U2-Net model...")
    model = U2NET(3, 1)  # 3 input channels (RGB), 1 output channel (grayscale mask)
    model.load_state_dict(torch.load(MODEL_PATH, map_location="cpu"))
    model.eval()  # Set the model to evaluation mode
    print("Model loaded successfully.")
    return model

# Preprocess the image
def preprocess_image(image_path, original_size):
    transform = transforms.Compose([
        transforms.Resize((320, 320)),  # Resize the image to 320x320
        transforms.ToTensor(),         # Convert to tensor
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])  # Normalize
    ])
    image = Image.open(image_path).convert("RGB")  # Open image and convert to RGB
    return transform(image).unsqueeze(0), original_size

# Post-process the mask
def postprocess_mask(mask, original_size):
    mask = mask.squeeze().cpu().data.numpy()  # Convert to NumPy array
    mask = (mask - mask.min()) / (mask.max() - mask.min())  # Normalize to [0, 1]
    mask = (mask * 255).astype(np.uint8)  # Scale to [0, 255]
    return cv2.resize(mask, original_size[::-1])  # Resize to original dimensions (width, height)

# Process all images in the input directory
def generate_cloth_masks():
    # Load the model
    model = load_model()

    # Get all images in the input directory
    image_files = [f for f in os.listdir(input_dir) if f.endswith(('.jpg', '.png'))]

    for image_name in image_files:
        input_image_path = os.path.join(input_dir, image_name)
        output_mask_path = os.path.join(output_dir, image_name)

        # Read the original image to get its size
        original_image = cv2.imread(input_image_path)
        if original_image is None:
            print(f"Skipping {image_name}, could not load image.")
            continue

        original_size = original_image.shape[:2]  # (height, width)

        # Preprocess the input image
        print(f"Processing image: {image_name}")
        input_image, original_size = preprocess_image(input_image_path, original_size)

        # Forward pass through the model
        with torch.no_grad():
            output = model(input_image)[0]  # Get the first output from the model
            mask = postprocess_mask(output, original_size)

        # Save the generated mask
        cv2.imwrite(output_mask_path, mask)
        print(f"Cloth mask saved at: {output_mask_path}")

if __name__ == "__main__":
    generate_cloth_masks()
