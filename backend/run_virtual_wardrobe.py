import subprocess
import os
import shutil

# Paths
openpose_path = r"D:\VITON-HD-main\openpose"
cloth_masking_path = r"D:\VITON-HD-main\automation"
viton_hd_path = r"D:\VITON-HD-main"

openpose_img_dir = r"D:\VITON-HD-main\datasets\test\openpose-img"
openpose_json_dir = r"D:\VITON-HD-main\datasets\test\openpose-json"
cloth_mask_dir = r"D:\VITON-HD-main\datasets\test\cloth-mask"
result_dir = r"D:\VITON-HD-main\results\alias_final.pth"
test_pairs_path = r"D:\VITON-HD-main\datasets\test_pairs.txt"
temp_cloth_input = r"D:\VITON-HD-main\temp_cloth_input"

# Ensure dirs
os.makedirs(openpose_img_dir, exist_ok=True)
os.makedirs(openpose_json_dir, exist_ok=True)
os.makedirs(cloth_mask_dir, exist_ok=True)
os.makedirs(result_dir, exist_ok=True)
os.makedirs(temp_cloth_input, exist_ok=True)

# Read last pair
with open(test_pairs_path, "r") as f:
    last_line = f.readlines()[-1].strip()
    user_img, cloth_img = last_line.split()

print(f"\n🔄 Processing new pair: {user_img}, {cloth_img}")

# Define expected outputs
expected_openpose_img = os.path.join(openpose_img_dir, user_img.replace(".jpg", "_rendered.png"))
expected_openpose_json = os.path.join(openpose_json_dir, user_img.replace(".jpg", "_keypoints.json"))
expected_cloth_mask = os.path.join(cloth_mask_dir, cloth_img)
expected_viton_output = os.path.join(result_dir, f"{user_img.split('_')[0]}_{cloth_img}")

# Step 1: OpenPose
openpose_cmd = rf'bin\OpenPoseDemo.exe --image_dir "D:/VITON-HD-main/datasets/test/image" --hand --disable_blending --body 1 --write_images "{openpose_img_dir}" --write_json "{openpose_json_dir}" --display 0'

if os.path.exists(expected_openpose_img) and os.path.exists(expected_openpose_json):
    print(f"✅ OpenPose output already exists. Skipping OpenPose...")
else:
    print(f"\n🔹 Running OpenPose...")
    subprocess.run(openpose_cmd, shell=True, cwd=openpose_path)

# Step 2: Cloth Masking
# Clear temp input folder
for f in os.listdir(temp_cloth_input):
    os.remove(os.path.join(temp_cloth_input, f))

# Copy current cloth image
shutil.copyfile(
    os.path.join("D:/VITON-HD-main/datasets/test/cloth", cloth_img),
    os.path.join(temp_cloth_input, cloth_img)
)

cloth_masking_cmd = rf'python generate_cloth_mask.py "{temp_cloth_input}" "{cloth_mask_dir}"'

if os.path.exists(expected_cloth_mask):
    print(f"✅ Cloth Mask output already exists. Skipping Cloth Masking...")
else:
    print(f"\n🔹 Running Cloth Masking...")
    subprocess.run(cloth_masking_cmd, shell=True, cwd=cloth_masking_path)

# Step 3: VITON-HD
viton_hd_cmd = r'python test.py --name alias_final.pth'

if os.path.exists(expected_viton_output):
    print(f"✅ VITON-HD output already exists: {expected_viton_output}. Skipping VITON-HD...")
else:
    print("\n🔹 Running VITON-HD Final Pipeline...")
    subprocess.run(viton_hd_cmd, shell=True, cwd=viton_hd_path)

# Step 4: Clean test_pairs.txt
with open(test_pairs_path, "w") as f:
    f.write("")
print(f"\n🧹 test_pairs.txt cleaned after processing the pair.")

print("\n✅ All processes completed successfully!")
