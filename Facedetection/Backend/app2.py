from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64
from io import BytesIO
from PIL import Image

# Import your models (ensure face_detector.py and face_landmarks.py are in the same folder)
from head_pose import detect_marks, find_faces, face_model, landmark_model, model_points

app = Flask(__name__)
CORS(app)  # Allow React frontend to communicate

def get_rotation_vector(image_points, camera_matrix):
    dist_coeffs = np.zeros((4, 1))
    success, rotation_vector, translation_vector = cv2.solvePnP(
        model_points, image_points, camera_matrix, dist_coeffs, flags=cv2.SOLVEPNP_UPNP
    )
    return rotation_vector, translation_vector

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    img_data = data['image'].split(',')[1]  # Remove data URL prefix
    img = np.array(Image.open(BytesIO(base64.b64decode(img_data))))
    img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)

    # Camera matrix (approximate)
    h, w = img.shape[:2]
    focal_length = w
    center = (w / 2, h / 2)
    camera_matrix = np.array([
        [focal_length, 0, center[0]],
        [0, focal_length, center[1]],
        [0, 0, 1]
    ], dtype="double")

    # Detect face and landmarks
    faces = find_faces(img, face_model)
    results = []

    for face in faces:
        marks = detect_marks(img, landmark_model, face)
        image_points = np.array([
            marks[30],  # Nose tip
            marks[8],   # Chin
            marks[36],  # Left eye left
            marks[45],  # Right eye right
            marks[48],  # Left mouth
            marks[54],  # Right mouth
        ], dtype="double")

        try:
            rvec, tvec = get_rotation_vector(image_points, camera_matrix)

            # Project nose line
            nose_end_point2D, _ = cv2.projectPoints(
                np.array([(0.0, 0.0, 1000.0)]), rvec, tvec, camera_matrix, np.zeros((4,1))
            )
            p1 = (int(image_points[0][0]), int(image_points[0][1]))
            p2 = (int(nose_end_point2D[0][0][0]), int(nose_end_point2D[0][0][1]))

            # Calculate angles
            try:
                pitch = np.degrees(np.atan2(p2[1] - p1[1], p2[0] - p1[0]))
            except:
                pitch = 90

            x1, x2 = (0, 0), (0, 0)  # You can add yaw logic here
            try:
                side_points = get_2d_points(img, rvec, tvec, camera_matrix, [1, 0, w, 2*w])
                x1 = side_points[2]
                x2 = (side_points[7][0], (side_points[5][1] + side_points[8][1]) // 2)
                yaw = np.degrees(np.atan2(-(x2[0] - x1[0]), x2[1] - x1[1]))
            except:
                yaw = 0

            # Determine pose
            head_pose = {
                "pitch": float(pitch),
                "yaw": float(yaw),
                "vertical": "up" if pitch < -15 else "down" if pitch > 15 else "forward",
                "horizontal": "left" if yaw < -15 else "right" if yaw > 15 else "center"
            }
            results.append(head_pose)
        except Exception as e:
            print("Error in pose estimation:", str(e))

    return jsonify(results if results else [{"error": "No face detected"}])

if __name__ == '__main__':
    app.run(port=5000, debug=True)