// components/Profile.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import {
  FaEye,
  FaFilePdf,
  FaTrashAlt,
  FaUser,
  FaBriefcase,
  FaCode,
  FaGraduationCap,
  FaSlidersH,
  FaUpload,
} from "react-icons/fa";

const Profile = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    yearsOfExperience: "",
    resume: "",
    currentRole: "",
    currentCompany: "",
    targetRole: "",
    professionalSummary: "",
    technicalSkills: [],
    degree: "",
    major: "",
    university: "",
    graduationYear: "",
    preferredDifficulty: "",
    preferredDuration: "",
    targetCompanies: "",
    profilePhoto: "",
  });
    const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("resume", file);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await axios.post(`${apiUrl}/upload-resume`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm((prev) => ({ ...prev, resume: res.data.resumeUrl }));
    } catch (err) {
      console.error("Resume upload failed", err);
      alert("Failed to upload resume.");
    }
  };

  const handleProfilePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, profilePhoto: file }));
    }
  };

  const addSkill = () => {
    const input = document.querySelector('input[placeholder="Add a skill (press Enter)"]');
    const value = input.value.trim();
    if (value && !form.technicalSkills.includes(value)) {
      setForm((prev) => ({
        ...prev,
        technicalSkills: [...prev.technicalSkills, value],
      }));
      input.value = "";
    }
  };

  const removeSkill = (index) => {
    setForm((prev) => ({
      ...prev,
      technicalSkills: prev.technicalSkills.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "profilePhoto") {
          if (value instanceof File) {
            formData.append("profilePhoto", value);
          } else if (typeof value === "string" && value.startsWith("http")) {
            formData.append("profilePhotoUrl", value);
          }
        } else if (key === "targetCompanies") {
          value
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean)
            .forEach((company) => formData.append("targetCompanies", company));
        } else if (Array.isArray(value)) {
          value.forEach((v) => formData.append(key, v));
        } else if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      await axios.post(`${apiUrl}/user`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Profile saved successfully!");
      navigate("/dashboard"); // Redirect to dashboard after successful save
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save profile.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Personal Information */}
      <div className="bg-white shadow-lg rounded-xl p-8 mb-8 border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-800">
          <FaUser className="text-teal-600" /> Personal Information
        </h2>
        <div className="flex items-start mb-6">
          {/* Profile Photo */}
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-teal-100 shadow-md">
            {form.profilePhoto ? (
              <img
                src={
                  form.profilePhoto instanceof File
                    ? URL.createObjectURL(form.profilePhoto)
                    : form.profilePhoto
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400">
                <FaUser size={56} />
              </div>
            )}
          </div>

          {/* Name Fields */}
          <div className="ml-8 flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              required
            />
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              required
            />
          </div>
        </div>

        {/* Change Photo Button */}
        <div className="mb-6">
          <label
            htmlFor="photo-upload"
            className="text-sm bg-teal-50 text-teal-700 hover:bg-teal-100 px-4 py-2 rounded-lg cursor-pointer border border-teal-200 inline-flex items-center gap-1"
          >
            📷 Change Photo
          </label>
          <input
            type="file"
            accept="image/*"
            id="photo-upload"
            onChange={handleProfilePhotoUpload}
            className="hidden"
          />
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="New York, USA"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
            <select
              name="yearsOfExperience"
              value={form.yearsOfExperience}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            >
              <option value="">Select experience</option>
              <option value="fresher">Fresher</option>
              <option value="1">1 year</option>
              <option value="2">2 years</option>
              <option value="3">3 years</option>
              <option value="4">4 years</option>
              <option value="5">5+ years</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resume */}
      <div className="bg-white shadow-lg rounded-xl p-8 mb-8 border border-gray-100">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-gray-800">
          <FaFilePdf className="text-teal-600" /> Resume
        </h2>
        <p className="text-gray-600 mb-6">Upload your latest resume to personalize your interview prep.</p>

        <div className="border-2 border-dashed border-teal-200 rounded-xl p-8 text-center bg-teal-50">
          <FaFilePdf size={40} className="mx-auto text-teal-500 mb-3" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">Upload Your Resume</h3>
          <p className="text-gray-500 mb-4">Drag and drop or click to browse</p>
          <label
            htmlFor="resume-upload"
            className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-3 rounded-lg cursor-pointer inline-flex items-center gap-2 font-medium transition"
          >
            <FaUpload /> Choose File
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            id="resume-upload"
            onChange={handleResumeUpload}
            className="hidden"
          />
          <p className="text-xs text-gray-400 mt-3">PDF, DOC, DOCX (Max 5MB)</p>
        </div>

        {form.resume && (
          <div className="mt-6 bg-white border border-green-200 rounded-lg p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center">
              <FaFilePdf className="text-red-500 mr-3" size={24} />
              <div>
                <p className="font-medium text-gray-800">{form.resume.split("/").pop()}</p>
                <p className="text-sm text-gray-500">Uploaded successfully</p>
              </div>
            </div>
            <button
              onClick={() => setForm((prev) => ({ ...prev, resume: "" }))}
              className="text-red-500 hover:text-red-700"
            >
              <FaTrashAlt />
            </button>
          </div>
        )}
      </div>

      {/* Technical Skills */}
      <div className="bg-white shadow-lg rounded-xl p-8 mb-8 border border-gray-100">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-gray-800">
          <FaCode className="text-teal-600" /> Technical Skills
        </h2>
        <p className="text-gray-600 mb-4">Add skills to receive tailored interview questions.</p>

        {/* Skills List */}
        <div className="flex flex-wrap gap-3 mb-4">
          {form.technicalSkills.length === 0 ? (
            <span className="text-gray-400 italic">No skills added yet</span>
          ) : (
            form.technicalSkills.map((skill, index) => (
              <span
                key={index}
                className="bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2"
              >
                {skill}
                <button
                  type="button"
                  onClick={removeSkill.bind(null, index)}
                  className="ml-1 text-red-500 hover:text-red-700 font-bold"
                >
                  ×
                </button>
              </span>
            ))
          )}
        </div>

        {/* Add Skill Input */}
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Add a skill (press Enter)"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            onKeyDown={(e) => e.key === "Enter" && addSkill()}
          />
          <button
            type="button"
            onClick={addSkill}
            className="bg-gray-800 hover:bg-black text-white px-5 py-3 rounded-lg font-medium transition"
          >
            Add
          </button>
        </div>
      </div>

      {/* Professional Background */}
      <div className="bg-white shadow-lg rounded-xl p-8 mb-8 border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-800">
          <FaBriefcase className="text-teal-600" /> Professional Background
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Role</label>
            <input
              type="text"
              name="currentRole"
              value={form.currentRole}
              onChange={handleChange}
              placeholder="e.g. Frontend Developer"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Company</label>
            <input
              type="text"
              name="currentCompany"
              value={form.currentCompany}
              onChange={handleChange}
              placeholder="e.g. TechCorp"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Target Role</label>
          <input
            type="text"
            name="targetRole"
            value={form.targetRole}
            onChange={handleChange}
            placeholder="e.g. Senior Developer"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
          <textarea
            name="professionalSummary"
            value={form.professionalSummary}
            onChange={handleChange}
            placeholder="Tell us about your experience and goals..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>
      </div>

      {/* Education */}
      <div className="bg-white shadow-lg rounded-xl p-8 mb-8 border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-800">
          <FaGraduationCap className="text-teal-600" /> Education
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
            <input
              type="text"
              name="degree"
              value={form.degree}
              onChange={handleChange}
              placeholder="e.g. B.Sc Computer Science"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Major</label>
            <input
              type="text"
              name="major"
              value={form.major}
              onChange={handleChange}
              placeholder="e.g. Software Engineering"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
            <input
              type="text"
              name="university"
              value={form.university}
              onChange={handleChange}
              placeholder="e.g. Stanford University"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
            <input
              type="number"
              name="graduationYear"
              value={form.graduationYear}
              onChange={handleChange}
              placeholder="2020"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
        </div>
      </div>

      {/* Interview Preferences */}
      <div className="bg-white shadow-lg rounded-xl p-8 mb-8 border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-800">
          <FaSlidersH className="text-teal-600" /> Interview Preferences
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
            <select
              name="preferredDifficulty"
              value={form.preferredDifficulty}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            >
              <option value="">Select difficulty</option>
              <option value="easy">Beginner</option>
              <option value="medium">Intermediate</option>
              <option value="hard">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
            <select
              name="preferredDuration"
              value={form.preferredDuration}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            >
              <option value="">Select duration</option>
              <option value="15 minutes">15 minutes</option>
              <option value="30 minutes">30 minutes</option>
              <option value="45 minutes">45 minutes</option>
              <option value="60 minutes">60 minutes</option>
            </select>
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Target Companies</label>
          <input
            type="text"
            name="targetCompanies"
            value={form.targetCompanies}
            onChange={handleChange}
            placeholder="Google, Meta, Amazon"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-4 mt-8">
        <button
          type="button"
          onClick={() => alert("Changes discarded")}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-8 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition transform hover:scale-105 font-semibold shadow-lg"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Profile;