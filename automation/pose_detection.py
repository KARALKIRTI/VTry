import os
import json
from PIL import Image, ImageDraw
import cv2
import numpy as np
from ultralytics import YOLO

# Paths
input_image_path = "D:\\VITON-HD-main\\input_images\\00891_00.jpg"
pose_output_path = "D:\\VITON-HD-main\\results\\openpose-img\\00891_00_rendered.png"
keypoints_output_path = "D:\\VITON-HD-main\\results\\openpose-json\\00891_00_keypoints.json"
model_path = "D:\\VITON-HD-main\\models\\yolo11x-pose.pt"

# Create output directories
os.makedirs(os.path.dirname(pose_output_path), exist_ok=True)
os.makedirs(os.path.dirname(keypoints_output_path), exist_ok=True)

# Load YOLO pose model
model = YOLO(model_path)

# Run pose detection
results = model(input_image_path, task="pose", save=False)

for result in results:
    if result.keypoints is None:
        print("No keypoints detected. Check the input image or model settings.")
        continue

    # Keypoints processing
    keypoints = result.keypoints.data.cpu().numpy()  # Get keypoints as NumPy array
    formatted_keypoints = {
        "version": 1.3,
        "people": [
            {
                "person_id": [-1],
                "pose_keypoints_2d": keypoints[0].flatten().tolist()  # Assuming single person
            }
        ]
    }

    # Save JSON to file
    with open(keypoints_output_path, "w") as f:
        json.dump(formatted_keypoints, f, indent=4)
    print(f"Keypoints JSON saved at: {keypoints_output_path}")

    # Create black background
    orig_image = cv2.imread(input_image_path)
    black_background = np.zeros_like(orig_image)

    # Plot pose on black background
    pose_image = result.plot(labels=False, boxes=False, conf=False, masks=False)
    pose_with_black_bg = cv2.addWeighted(black_background, 1, pose_image, 1, 0)

    # Save pose image
    cv2.imwrite(pose_output_path, pose_with_black_bg)
    print(f"Pose image saved at: {pose_output_path}")
