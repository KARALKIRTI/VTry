import torch
import numpy as np
import cv2
import os
import glob
from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
import subprocess

app = Flask(__name__)
CORS(app)  # Enable CORS

# Paths
UPLOAD_FOLDER_IMAGE = "D:/VITON-HD-main/datasets/test/image"
UPLOAD_FOLDER_CLOTH = "D:/VITON-HD-main/datasets/test/cloth"
RESULT_FOLDER = "D:/VITON-HD-main/results/alias_final.pth/"  # Folder containing the output images
SCRIPT_PATH = "D:/VITON-HD-main/backend/run_virtual_wardrobe.py"
TEST_PAIRS_FILE = "D:/VITON-HD-main/datasets/test_pairs.txt"  # ✅ Test Pairs File

# Ensure directories exist
os.makedirs(UPLOAD_FOLDER_IMAGE, exist_ok=True)
os.makedirs(UPLOAD_FOLDER_CLOTH, exist_ok=True)
os.makedirs(RESULT_FOLDER, exist_ok=True)

@app.route("/upload", methods=["POST"])
def upload_images():
    if "user_image" not in request.files or "cloth_image" not in request.files:
        return jsonify({"error": "Missing files"}), 400

    user_image = request.files["user_image"]
    cloth_image = request.files["cloth_image"]

    if user_image.filename == "" or cloth_image.filename == "":
        return jsonify({"error": "Empty file received"}), 400  

    user_image_path = os.path.join(UPLOAD_FOLDER_IMAGE, user_image.filename)
    cloth_image_path = os.path.join(UPLOAD_FOLDER_CLOTH, cloth_image.filename)

    user_image.save(user_image_path)
    cloth_image.save(cloth_image_path)

    try:
        print(f"User Image: {user_image_path}")
        print(f"Cloth Image: {cloth_image_path}")
        print(f"Writing to test_pairs.txt at {TEST_PAIRS_FILE}")

        with open(TEST_PAIRS_FILE, "a") as f:
            f.write(f"{user_image.filename} {cloth_image.filename}\n")

        print(f"Added: {user_image.filename} {cloth_image.filename} to test_pairs.txt")

    except Exception as e:
        print(f"❌ Error writing to test_pairs.txt: {e}")
        return jsonify({"error": "Failed to update test_pairs.txt", "details": str(e)}), 500

    return jsonify({"message": "Images uploaded successfully!"})

@app.route("/process", methods=["POST"])
def process_images():
    try:
        with open(TEST_PAIRS_FILE, "r") as f:
            lines = f.readlines()

        if not lines:
            return jsonify({"error": "No image pairs found in test_pairs.txt"}), 500

        last_pair = lines[-1].strip().split()
        if len(last_pair) != 2:
            return jsonify({"error": "Invalid format in test_pairs.txt"}), 500

        user_image, cloth_image = last_pair
        user_id = user_image.split('.')[0].split('_')[0]  # e.g., 00891
        cloth_id = cloth_image.split('.')[0]  # e.g., 11351_00

        expected_result_name = f"{user_id}_{cloth_id}.jpg"
        expected_result_path = os.path.join(RESULT_FOLDER, expected_result_name)

        print(f"🧠 Expected result file should be: {expected_result_name}")

        if os.path.exists(expected_result_path):
            print(f"✅ Result already exists: {expected_result_name}")
            import time
            time.sleep(2)  # ⏳ Add 3 seconds delay to simulate processing animation
            return jsonify({"image_url": f"http://127.0.0.1:5000/result/{expected_result_name}"})

        print(f"🔄 Processing required for pair: {user_image}, {cloth_image}")
        subprocess.run(["python", SCRIPT_PATH], check=True)

        if os.path.exists(expected_result_path):
            return jsonify({"image_url": f"http://127.0.0.1:5000/result/{expected_result_name}"})
        else:
            return jsonify({"error": "Processed image not found after running model!"}), 500

    except subprocess.CalledProcessError as e:
        return jsonify({"error": "Processing failed!", "details": str(e)}), 500
    except Exception as e:
        return jsonify({"error": "Unexpected error", "details": str(e)}), 500

def find_latest_image(folder_path):
    image_files = glob.glob(os.path.join(folder_path, "*.jpg"))
    if not image_files:
        return None
    return max(image_files, key=os.path.getctime)

@app.route('/result/<filename>')
def get_result_image(filename):
    file_path = os.path.join(RESULT_FOLDER, filename)
    if os.path.exists(file_path):
        return send_file(file_path, mimetype='image/jpeg')
    else:
        return jsonify({"error": "File not found"}), 404

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
