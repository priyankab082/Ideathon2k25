# app2.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64
import os
import speech_recognition as sr
from datetime import datetime
import tempfile
import uuid
import mediapipe as mp

# Your head pose detection imports
from head_pose_prediction import detect_marks, find_faces, face_model, landmark_model, model_points, head_pose_points

# TensorFlow warning mitigation (optional if rebuilding model not possible)
import tensorflow.compat.v1 as tf
tf.disable_eager_execution()
tf.enable_resource_variables()

# MediaPipe Setup
mp_face_detection = mp.solutions.face_detection
face_detection = mp_face_detection.FaceDetection(
    model_selection=1,
    min_detection_confidence=0.7
)

app = Flask(__name__)
CORS(app)

TRANSCRIPTIONS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'transcriptions')
os.makedirs(TRANSCRIPTIONS_DIR, exist_ok=True)

# @app.route('/transcribe-audio', methods=['POST'])
# def transcribe_audio():
#     try:
#         if 'audio' not in request.files:
#             return jsonify({'status': 'error', 'message': 'No audio file provided'}), 400

#         audio_file = request.files['audio']
#         temp_webm = tempfile.NamedTemporaryFile(delete=False, suffix='.webm')
#         audio_file.save(temp_webm.name)
#         temp_webm.close()

#         # Convert webm to wav using ffmpeg
#         temp_wav = tempfile.NamedTemporaryFile(delete=False, suffix='.wav')
#         ffmpeg_cmd = ['ffmpeg', '-i', temp_webm.name, '-ar', '16000', '-ac', '1', temp_wav.name, '-y']
#         subprocess.run(ffmpeg_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

#         # Transcribe using Vosk
#         wf = wave.open(temp_wav.name, "rb")
#         if wf.getnchannels() != 1 or wf.getsampwidth() != 2 or wf.getframerate() != 16000:
#             return jsonify({'status': 'error', 'message': 'Audio file must be WAV format with 16kHz mono'}), 400

#         rec = KaldiRecognizer(model, wf.getframerate())
#         results = []

#         while True:
#             data = wf.readframes(4000)
#             if len(data) == 0:
#                 break
#             if rec.AcceptWaveform(data):
#                 res = json.loads(rec.Result())
#                 results.append(res.get('text', ''))

#         final_res = json.loads(rec.FinalResult())
#         results.append(final_res.get('text', ''))
#         transcription = ' '.join(results).strip()

#         # Save to file
#         timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
#         filename = f"transcription_{timestamp}_{uuid.uuid4().hex[:8]}.txt"
#         file_path = os.path.join(TRANSCRIPTIONS_DIR, filename)

#         with open(file_path, 'w') as f:
#             f.write(transcription)

#         # Clean up temp files
#         os.unlink(temp_webm.name)
#         os.unlink(temp_wav.name)

#         return jsonify({
#             'status': 'success',
#             'transcription': transcription,
#             'saved_to': file_path
#         })

#     except Exception as e:
#         return jsonify({'status': 'error', 'message': f'An error occurred: {str(e)}'}), 500

# @app.route('/predict', methods=['POST'])
# def predict():
#     try:
#         data = request.get_json()
#         if not data or 'image' not in data:
#             return jsonify({"error": "No image data provided"}), 400

#         image_str = data['image']
#         encoded = image_str.split(",")[1] if ',' in image_str else image_str

#         img_data = base64.b64decode(encoded)
#         nparr = np.frombuffer(img_data, np.uint8)
#         frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

#         faces = find_faces(frame)
#         if faces is None or len(faces) == 0:
#             return jsonify({'error': 'No face detected'}), 404

#         for face in faces:
#             marks = detect_marks(frame, landmark_model, face)
#             image_points = head_pose_points(marks)

#             height, width, _ = frame.shape
#             focal_length = width
#             center = (width / 2, height / 2)
#             camera_matrix = np.array([
#                 [focal_length, 0, center[0]],
#                 [0, focal_length, center[1]],
#                 [0, 0, 1]
#             ], dtype="double")

#             dist_coeffs = np.zeros((4, 1))
#             success, rotation_vector, translation_vector = cv2.solvePnP(
#                 model_points, image_points, camera_matrix, dist_coeffs
#             )

#             # Determine direction using pitch/yaw/roll
#             rotation_mat, _ = cv2.Rodrigues(rotation_vector)
#             pose_mat = cv2.hconcat((rotation_mat, translation_vector))
#             _, _, _, _, _, _, euler_angles = cv2.decomposeProjectionMatrix(pose_mat)

#             pitch, yaw, roll = euler_angles.flatten()
#             direction = "Center"
#             if yaw < -15:
#                 direction = "Left"
#             elif yaw > 15:
#                 direction = "Right"
#             elif pitch < -15:
#                 direction = "Down"
#             elif pitch > 15:
#                 direction = "Up"

#             return jsonify({
#                 'status': 'success',
#                 'head_pose': {
#                     'pitch': float(pitch),
#                     'yaw': float(yaw),
#                     'roll': float(roll),
#                     'direction': direction
#                 }
#             })

#         return jsonify({'error': 'No valid face found'}), 404

#     except Exception as e:
#         return jsonify({'status': 'error', 'message': f'Prediction failed: {str(e)}'}), 500
@app.route('/detect-face', methods=['POST'])
def detect_face():
    if 'image' not in request.files:
        return jsonify({'status': 'error', 'message': 'No image provided'}), 400

    file = request.files['image']
    npimg = np.frombuffer(file.read(), np.uint8)
    image = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    if image is None:
        return jsonify({'status': 'error', 'message': 'Invalid image'}), 400

    try:
        h, w, _ = image.shape
        if h <= 0 or w <= 0:
            return jsonify({'status': 'error', 'message': 'Invalid image dimensions'}), 400
            
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        # Detect faces
        results = face_detection.process(image_rgb)
    except Exception as e:
        print(f"Error processing image: {str(e)}")
        return jsonify({'status': 'error', 'message': 'Error processing image'}), 500

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
                message = ""  # Don't display face detected message
    else:
        message = "❌No face detected. Please look at the camera."

    return jsonify({'status': 'success', 'message': message})




if __name__ == '__main__':
    app.run(debug=True)
