from groq import Groq
from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64
import math
from io import BytesIO
from PIL import Image

# Import from your script
# from head_pose_prediction import detect_marks, find_faces, face_model, landmark_model, model_points, head_pose_points
app = Flask(__name__)
CORS(app)  # ✅ Enable CORS


client = Groq(api_key="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")

QUESTION_PROMPT_TEMPLATE = """
You are an expert technical interviewer.

A candidate has submitted the following resume between triple quotes:

\"\"\"
{resume}
\"\"\"

Your task is to generate exactly 10 interview questions based only on the content of the resume.

Requirements:
- The questions must be relevant to the candidate’s resume (skills, experience, tools, projects, education, certifications, or achievements)
- The questions must increase in difficulty, starting from basic and ending at advanced
- Include a mix of technical and behavioral questions
- Do not explain your reasoning
- Do not include any thought process, preface, commentary, or formatting other than the question list
- Do not use any special characters like asterisks, parentheses, or markdown syntax
- Output only a clean, numbered list of 10 questions with no additional text

Respond only with the 10 questions.
"""


EVALUATION_TEMPLATE = """
You are a technical interviewer.

Evaluate the candidate's answer to the interview question based on the following criteria:
- Relevance to the Question
- Technical Accuracy
- Depth of Explanation
- Clarity and Confidence
- Professional Tone

Provide:
- Question #[n]: [Repeat the question]
- Candidate Answer: [The answer]
- Evaluation Summary: [2–3 sentence summary]
- Score: x/10
- Feedback: Suggestions for improvement, if any

Now evaluate:

Question: {question}
Answer: {answer}
"""


@app.route('/questions', methods=['POST'])
def generate_questions():
    data = request.get_json()
    resume = data.get("resume", "").strip()
    if not resume:
        return jsonify({"error": "No resume provided"}), 400

    prompt = QUESTION_PROMPT_TEMPLATE.format(resume=resume)


    response = client.chat.completions.create(
        model="deepseek-r1-distill-llama-70b",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    questions_text = response.choices[0].message.content.strip()
    questions = [q.strip() for q in questions_text.split("\n") if q.strip()]
    return jsonify({"questions": questions})


@app.route('/evaluate', methods=['POST'])
def evaluate_answer():
    data = request.get_json()
    question = data.get("question", "")
    answer = data.get("answer", "")

    if not question or not answer:
        return jsonify({"error": "Question and answer must be provided"}), 400

    evaluation_prompt = EVALUATION_TEMPLATE.format(question=question, answer=answer)

    response = client.chat.completions.create(
        model="deepseek-r1-distill-llama-70b",
        messages=[
            {"role": "user", "content": evaluation_prompt}
        ]
    )

    evaluation = response.choices[0].message.content.strip()
    return jsonify({"evaluation": evaluation}), 200

# @app.route('/predict', methods=['POST'])
# def predict():
#     try:
#         # 🔹 1. Get JSON data
#         data = request.get_json()
#         if not data or 'image' not in data:
#             return jsonify({"error": "No image data provided"}), 400

#         image_str = data['image']

#         # 🔹 2. Parse base64
#         if ',' in image_str:
#             header, encoded = image_str.split(',', 1)
#         else:
#             encoded = image_str

#         try:
#             img_data = base64.b64decode(encoded)
#         except Exception as e:
#             return jsonify({"error": "Invalid base64", "details": str(e)}), 400

#         try:
#             img = Image.open(BytesIO(img_data))
#             img = np.array(img)
#         except Exception as e:
#             return jsonify({"error": "Cannot open image", "details": str(e)}), 400

#         # 🔹 3. Convert to BGR
#         if len(img.shape) == 2:
#             img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
#         elif img.shape[2] == 4:
#             img = cv2.cvtColor(img, cv2.COLOR_RGBA2BGR)
#         elif img.shape[2] == 3:
#             img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
#         else:
#             return jsonify({"error": "Unsupported image format"}), 400

#         h, w = img.shape[:2]

#         # 🔹 4. Camera matrix
#         focal_length = w
#         center = (w / 2, h / 2)
#         camera_matrix = np.array([
#             [focal_length, 0, center[0]],
#             [0, focal_length, center[1]],
#             [0, 0, 1]
#         ], dtype="double")

#         dist_coeffs = np.zeros((4, 1))

#         # 🔹 5. Detect face
#         faces = find_faces(img, face_model)
#         if len(faces) == 0:
#             return jsonify([{
#                 "vertical": "unknown",
#                 "horizontal": "unknown",
#                 "pitch": 0,
#                 "yaw": 0,
#                 "error": "No face detected"
#             }]), 200

#         face = faces[0]
#         try:
#             marks = detect_marks(img, landmark_model, face)
#         except Exception as e:
#             return jsonify({"error": "Landmark detection failed", "details": str(e)}), 500

#         # 🔹 6. Image points
#         image_points = np.array([
#             marks[30],  # Nose tip
#             marks[8],   # Chin
#             marks[36],  # Left eye left
#             marks[45],  # Right eye right
#             marks[48],  # Left mouth
#             marks[54]   # Right mouth
#         ], dtype="double")

#         # 🔹 7. Solve PnP
#         try:
#             success, rvec, tvec = cv2.solvePnP(
#                 model_points, image_points, camera_matrix, dist_coeffs, flags=cv2.SOLVEPNP_UPNP
#             )
#             if not success:
#                 return jsonify({"error": "PnP solver failed"}), 500
#         except Exception as e:
#             return jsonify({"error": "solvePnP failed", "details": str(e)}), 500

#         # 🔹 8. Project nose vector
#         try:
#             nose_2d, _ = cv2.projectPoints(
#                 np.array([[0.0, 0.0, 1000.0]]), rvec, tvec, camera_matrix, dist_coeffs
#             )
#             p1 = (int(image_points[0][0]), int(image_points[0][1]))
#             p2 = (int(nose_2d[0][0][0]), int(nose_2d[0][0][1]))

#             pitch = math.degrees(math.atan2(p2[1] - p1[1], p2[0] - p1[0]))
#         except:
#             pitch = 0

#         # 🔹 9. Yaw (horizontal)
#         try:
#             x1, x2 = head_pose_points(img, rvec, tvec, camera_matrix)
#             yaw = math.degrees(math.atan2(-(x2[0] - x1[0]), x2[1] - x1[1]))
#         except:
#             yaw = 0

#         # 🔹 10. Classify
#                 # 🔹 10. Classify
#         vertical = "up" if pitch < -15 else "down" if pitch > 15 else "forward"
#         horizontal = "right" if yaw > 15 else "left" if yaw < -15 else "center"

#         return jsonify([{
#             "vertical": vertical,
#             "horizontal": horizontal,
#             "pitch": float(pitch),
#             "yaw": float(yaw)
#         }])

#     except Exception as e:
#         print("❌ Server error:", str(e))
#         return jsonify({
#             "error": "Internal server error",
#             "details": str(e)
#         }), 500

if __name__== "__main__":
    app.run(host="localhost", port=4000)