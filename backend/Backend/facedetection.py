from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import mediapipe as mp
import time

app = Flask(__name__)
CORS(app)

# Limit upload size to 2MB
app.config['MAX_CONTENT_LENGTH'] = 2 * 1024 * 1024  # 2MB

# Initialize MediaPipe Face Detection (only once)
mp_face_detection = mp.solutions.face_detection
face_detection = mp_face_detection.FaceDetection(
    model_selection=1,
    min_detection_confidence=0.7
)

@app.route('/detect-face', methods=['POST'])
def detect_face():
    start_time = time.time()

    if 'image' not in request.files:
        return jsonify({'status': 'error', 'message': 'No image provided'}), 400

    file = request.files['image']
    npimg = np.frombuffer(file.read(), np.uint8)
    image = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    if image is None:
        return jsonify({'status': 'error', 'message': 'Invalid image'}), 400

    # Resize image for faster processing
    image = cv2.resize(image, (640, 480))
    h, w = image.shape[:2]

    # Convert BGR to RGB
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # Detect faces
    results = face_detection.process(image_rgb)

    message = ""

    if results.detections:
        face_boxes = []
        for detection in results.detections:
            bboxC = detection.location_data.relative_bounding_box
            x1 = int(bboxC.xmin * w)
            y1 = int(bboxC.ymin * h)
            x2 = int((bboxC.xmin + bboxC.width) * w)
            y2 = int((bboxC.ymin + bboxC.height) * h)
            face_boxes.append((x1, y1, x2, y2))

        if len(face_boxes) > 1:
            message = "❌ Multiple faces detected. Only one person should be in frame."
        else:
            x1, y1, x2, y2 = face_boxes[0]
            if x1 < 0 or y1 < 0 or x2 > w or y2 > h:
                message = "⚠️ Face not fully visible. Adjust your position."
            else:
                message = "✅ Face detected and clearly visible."
    else:
        message = "😐 No face detected. Please look at the camera."

    end_time = time.time()
    print(f"⏱️ Face detection took: {end_time - start_time:.2f} seconds")

    return jsonify({'status': 'success', 'message': message})

if __name__ == '__main__':
    # Run only for development. Use Gunicorn for production.
    app.run(debug=True, port=5000)
