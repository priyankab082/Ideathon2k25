import React, { useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";

const PreInterviewForm = ({ onStartInterview }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setError("");
      } else {
        setError("Please upload a valid PDF file.");
        setFile(null);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a PDF resume to upload.");
      return;
    }

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("resume_pdf", file); // must match backend key

    try {
      const response = await fetch("http://localhost:4000/questions", {
        method: "POST",
        body: formData, // No Content-Type header when using FormData (browser sets it automatically)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      if (data.questions && Array.isArray(data.questions)) {
        const resumeText = data.resume_text || "PDF uploaded successfully.";
        onStartInterview(resumeText, data.questions);
      } else {
        throw new Error("Invalid response: missing questions.");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setError(
        err.message.includes("Failed to fetch")
          ? "Could not connect to the server. Is Flask running at http://localhost:4000?"
          : `Error: ${err.message}`
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-2xl w-full border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-3 text-center">Upload Your Resume</h2>
        <p className="text-gray-600 mb-6 text-center">Please upload your resume as a PDF file to begin the interview setup.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors duration-200">
            <label
              htmlFor="pdf-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              {file ? (
                <span className="text-green-600 font-medium">📄 {file.name}</span>
              ) : (
                <>
                  <IoCloudUploadOutline className="w-12 h-12 text-gray-400 mx-auto mb-4" />

                  <span className="text-lg text-indigo-600 hover:underline font-medium">
                    Choose PDF Resume
                  </span>
                  <span className="text-sm text-gray-500 mt-1">or drag and drop</span>
                </>
              )}
              <input
                id="pdf-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="sr-only" // Hidden visually but accessible
              />
            </label>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={uploading}
            className="w-full px-7 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg rounded-2xl shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-80 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02]"
          >
            {uploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 inline" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Uploading & Processing...
              </>
            ) : (
              "Start Interview"
            )}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-4">
          We only use your resume to personalize the interview. It will not be stored.
        </p>
      </div>
    </div>
  );
};

export default PreInterviewForm;