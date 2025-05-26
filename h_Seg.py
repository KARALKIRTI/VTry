

from transformers import SegformerForSemanticSegmentation, SegformerFeatureExtractor
from PIL import Image
import torch
import matplotlib.pyplot as plt

# Load the feature extractor and model
feature_extractor = SegformerFeatureExtractor.from_pretrained("yolo12138/segformer-b2-human-parse-24")
model = SegformerForSemanticSegmentation.from_pretrained("yolo12138/segformer-b2-human-parse-24")

# Set device (CPU or GPU)
device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)

# Load your local image
image_path =  r"D:\VITON-HD-main\datasets\test\image\07445_00.jpg"  # Replace with the path to your image
image = Image.open(image_path).convert("RGB")  # Ensure image is in RGB mode

# Preprocess the image
inputs = feature_extractor(images=image, return_tensors="pt")
inputs = {key: value.to(device) for key, value in inputs.items()}

# Perform inference
with torch.no_grad():
    outputs = model(**inputs)

# Get the segmentation result
logits = outputs.logits  # Shape: (batch_size, num_labels, height, width)
segmentation = torch.argmax(logits, dim=1).squeeze(0).cpu().numpy()

# Visualize the segmentation result
plt.figure(figsize=(10, 10))
plt.imshow(segmentation)
plt.axis("off")
plt.title("Segmentation Result")
plt.show()
