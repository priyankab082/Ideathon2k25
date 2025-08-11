from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import time
import mediapipe as mp
# from openai import OpenAI
import os
from dotenv import load_dotenv
import traceback
from groq import Groq
import os
mp_face_detection = mp.solutions.face_detection
face_detection = mp_face_detection.FaceDetection(
    model_selection=1,
    min_detection_confidence=0.7
)

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5173"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True,
    }
})
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

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

    try:
        h, w, _ = image.shape
        if h <= 0 or w <= 0:
            return jsonify({'status': 'error', 'message': 'Invalid image dimensions'}), 400

        max_dim = 640
        if max(h, w) > max_dim:
            scaling_factor = max_dim / float(max(h, w))
            image = cv2.resize(image, None, fx=scaling_factor, fy=scaling_factor, interpolation=cv2.INTER_AREA)
            h, w, _ = image.shape

        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

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
                message = ""
    else:
        message = "❌ No face detected. Please look at the camera."

    total_time = time.time() - start_time
    print(f"Face detection time: {total_time:.3f} seconds")

    return jsonify({'status': 'success', 'message': message})



load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
@app.route("/api/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        user_message = data.get("message", "").strip()

        if not user_message:
            return jsonify({"error": "No message provided"}), 400

        # New API style
        response = client.chat.completions.create(
    model="llama3-70b-8192",  # ✅ valid model
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": user_message}
    ]
)


        ai_reply = response.choices[0].message.content

        return jsonify({
            "reply": ai_reply,
            "timestamp": response.created
        })

    except Exception as e:
        print("Error:", str(e))
        traceback.print_exc()
        return jsonify({"error": "Sorry, AI service is unavailable."}), 500
@app.route("/api/score", methods=["POST"])
def get_score():
    try:
        data = request.get_json()
        chat_history = data.get("chatHistory", [])

        if not chat_history:
            return jsonify({"error": "No chat history provided"}), 400

        # Convert chat history to readable format
        conversation = "\n".join([
            f"{msg['sender'].capitalize()}: {msg['content']}"
            for msg in chat_history if msg.get("content") and msg.get("sender")
        ])

        prompt = f"""
        You are an expert technical interviewer. Based on the following interview transcript,
        evaluate the candidate's overall performance and give a score from 1 to 10.

        Consider:
        - Clarity and completeness of answers
        - Technical accuracy
        - Communication skills
        - Depth of understanding

        Respond ONLY with a JSON object in this format:
        {{
          "score": 7.5,
          "summary": "The candidate showed good understanding of core concepts but lacked depth in advanced topics."
        }}

        Interview Transcript:
        {conversation}
        """

        response = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[
                {"role": "system", "content": "You are an expert interviewer. Respond only in valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=200
        )

        # Parse LLM response
        raw_response = response.choices[0].message.content.strip()

        # Clean up response if it starts with ```json
        if raw_response.startswith("```json"):
            raw_response = raw_response[7:].split("```")[0].strip()

        result = eval(raw_response)  # Use json.loads if safe; eval is risky in prod

        return jsonify({
            "score": float(result["score"]),
            "summary": result["summary"],
            "timestamp": response.created
        })

    except Exception as e:
        print("Scoring error:", str(e))
        traceback.print_exc()
        return jsonify({
            "score": 5.0,
            "summary": "Could not generate score. Default provided."
        }), 200  # Return safe default


@app.route("/api/feedback", methods=["POST"])
def get_feedback():
    try:
        data = request.get_json()
        chat_history = data.get("chatHistory", [])

        if not chat_history:
            return jsonify({"error": "No chat history provided"}), 400

        conversation = "\n".join([
            f"{msg['sender'].capitalize()}: {msg['content']}"
            for msg in chat_history if msg.get("content") and msg.get("sender")
        ])

        prompt = f"""
        You are a career coach reviewing a technical interview.
        Based on the transcript below, provide structured feedback.

        Respond in JSON format:
        {{
          "strengths": ["Clear communication", "Good fundamentals"],
          "improvement_areas": ["Database indexing", "System design patterns"],
          "recommendations": "Study more on distributed systems and practice whiteboarding."
        }}

        Transcript:
        {conversation}
        """

        response = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[
                {"role": "system", "content": "You are a helpful career coach. Respond only in valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.4,
            max_tokens=300
        )

        raw_response = response.choices[0].message.content.strip()
        if raw_response.startswith("```json"):
            raw_response = raw_response[7:].split("```")[0].strip()

        result = eval(raw_response)

        return jsonify(result)

    except Exception as e:
        print("Feedback error:", str(e))
        traceback.print_exc()
        return jsonify({
            "strengths": ["Participated fully", "Tried to answer"],
            "improvement_areas": ["General knowledge", "Confidence"],
            "recommendations": "Review core CS topics and practice mock interviews."
        }), 200
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
