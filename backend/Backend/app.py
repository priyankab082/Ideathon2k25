from groq import Groq
from flask import Flask, request, jsonify
from flask_cors import CORS
import io
import logging
import os
from dotenv import load_dotenv
from PyPDF2 import PdfReader

# Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)

# Initialize Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Prompt Templates
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

def extract_text_from_pdf(pdf_file):
    """Extract text from uploaded PDF file."""
    try:
        pdf_reader = PdfReader(pdf_file)
        text = ""
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        return text.strip()
    except Exception as e:
        raise Exception(f"Failed to extract text from PDF: {str(e)}")

@app.route('/questions', methods=['POST'])
def generate_questions():
    try:
        print(request.files)
        # Check if file is uploaded
        if 'resume_pdf' in request.files:
            file = request.files['resume_pdf']
            if file.filename == "":
                return jsonify({"error": "No selected file"}), 400
            if not file.filename.lower().endswith('.pdf'):
                return jsonify({"error": "Only PDF files are allowed"}), 400

            pdf_stream = io.BytesIO(file.read())
            resume_text = extract_text_from_pdf(pdf_stream)

        elif request.is_json:
            data = request.get_json()
            resume_text = data.get("resume", "").strip()
            if not resume_text:
                return jsonify({"error": "No resume text provided"}), 400

        else:
            return jsonify({"error": "No valid input. Provide 'resume_pdf' file or 'resume' text."}), 400

        if not resume_text:
            return jsonify({"error": "Extracted resume is empty"}), 400

        app.logger.info(f"Resume extracted (first 300 chars): {resume_text[:300]}...")

        # Generate questions
        prompt = QUESTION_PROMPT_TEMPLATE.format(resume=resume_text)
        response = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5,
            max_tokens=1024,
        )

        raw_output = response.choices[0].message.content.strip()
        questions = []
        for line in raw_output.splitlines():
            line = line.strip()
            if not line:
                continue
            if line[0].isdigit():
                question = line.split('.', 1)[1].strip() if '.' in line else line.split(')', 1)[1].strip()
                questions.append(question)
            elif len(questions) < 10:
                questions.append(line)

        questions = (questions + ["Please tell us more about your experience."] * 10)[:10]

        return jsonify({
            "questions": questions,
            "resume_snippet": resume_text[:200] + "..."
        }), 200

    except Exception as e:
        app.logger.error(f"Error in /questions: {str(e)}")
        return jsonify({"error": "Failed to process PDF or generate questions", "details": str(e)}), 500

@app.route('/evaluate', methods=['POST'])
def evaluate_answer():
    try:
        data = request.get_json()
        question = data.get("question", "").strip()
        answer = data.get("answer", "").strip()

        if not question or not answer:
            return jsonify({"error": "Both 'question' and 'answer' are required"}), 400

        prompt = EVALUATION_TEMPLATE.format(question=question, answer=answer)
        response = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4,
            max_tokens=512,
        )

        evaluation = response.choices[0].message.content.strip()
        return jsonify({"evaluation": evaluation}), 200

    except Exception as e:
        app.logger.error(f"Evaluation error: {str(e)}")
        return jsonify({"error": "Failed to evaluate answer", "details": str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "message": "Server is running and ready to accept PDFs!"}), 200

if __name__ == "__main__":
    app.run(host="localhost", port=4000, debug=True)
