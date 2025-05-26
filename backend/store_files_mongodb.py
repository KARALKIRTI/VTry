import pymongo
import gridfs
import json
from flask import Flask, request, jsonify

# Connect to MongoDB
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["virtual_wardrobe"]
fs = gridfs.GridFS(db)

app = Flask(__name__)

# Store pairing data in MongoDB
def store_pairs(user_img, cloth_img):
    existing_pair = db.pairs.find_one({"user_image": user_img, "cloth_image": cloth_img})
    if not existing_pair:
        db.pairs.insert_one({"user_image": user_img, "cloth_image": cloth_img})
        print("✅ Added new pair to MongoDB")
    else:
        print("⚠️ Pair already exists in MongoDB")

# Upload images directly to MongoDB
def store_image(file, category, format):
    file_id = fs.put(file.read(), filename=file.filename)
    db.images.insert_one({
        "filename": file.filename,
        "category": category,
        "format": format,
        "file_id": file_id
    })
    return file.filename

# API endpoint to upload images
@app.route("/upload", methods=["POST"])
def upload_images():
    user_img = request.files.get("user_image")
    cloth_img = request.files.get("cloth_image")
    
    if not user_img or not cloth_img:
        return jsonify({"error": "Both images are required"}), 400
    
    user_filename = store_image(user_img, "image", "jpg")
    cloth_filename = store_image(cloth_img, "cloth", "jpg")
    
    store_pairs(user_filename, cloth_filename)
    return jsonify({"message": "Images uploaded and stored successfully", "user_image": user_filename, "cloth_image": cloth_filename})

# Store JSON keypoints data
def store_json(filename, json_data):
    db.json_files.insert_one({
        "filename": filename,
        "category": "openpose_json",
        "format": "json",
        "image_reference": filename.replace("_keypoints.json", ".jpg"),
        "json_data": json_data
    })
    print("✅ Stored JSON file in MongoDB")

# API endpoint to upload JSON keypoints
@app.route("/upload_json", methods=["POST"])
def upload_json():
    json_file = request.files.get("json_file")
    if not json_file:
        return jsonify({"error": "JSON file is required"}), 400
    
    json_data = json.load(json_file)
    store_json(json_file.filename, json_data)
    return jsonify({"message": "JSON file uploaded successfully", "filename": json_file.filename})

if __name__ == "__main__":
    app.run(debug=True)
