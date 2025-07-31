import React, { useState, useEffect } from "react";
import axios from "axios";
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

  const [resumeFile, setResumeFile] = useState(null);

//   useEffect(() => {
//     const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
//     axios.get(`${apiUrl}/user`).then((res) => {
//       if (res.data) {
//         // Ensure all form fields have default values to prevent controlled/uncontrolled input warnings
//         setForm({
//           firstName: res.data.firstName || "",
//           lastName: res.data.lastName || "",
//           email: res.data.email || "",
//           phone: res.data.phone || "",
//           location: res.data.location || "",
//           yearsOfExperience: res.data.yearsOfExperience || "",
//           resume: res.data.resume || "",
//           currentRole: res.data.currentRole || "",
//           currentCompany: res.data.currentCompany || "",
//           targetRole: res.data.targetRole || "",
//           professionalSummary: res.data.professionalSummary || "",
//           technicalSkills: res.data.technicalSkills || [],
//           degree: res.data.degree || "",
//           major: res.data.major || "",
//           university: res.data.university || "",
//           graduationYear: res.data.graduationYear || "",
//           preferredDifficulty: res.data.preferredDifficulty || "",
//           preferredDuration: res.data.preferredDuration || "",
//           targetCompanies: res.data.targetCompanies?.join(", ") || "",
//           profilePhoto: res.data.profilePhoto || "",
//         });
//       }
//     });
//   }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTechnicalSkillsChange = (e) => {
    const { value } = e.target;
    if (value && !form.technicalSkills.includes(value)) {
      setForm((prevForm) => ({
        ...prevForm,
        technicalSkills: [...prevForm.technicalSkills, value],
      }));
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    try {
      // Use Vite's environment variable format
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await axios.post(`${apiUrl}/upload-resume`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm((prev) => ({ ...prev, resume: res.data.resumeUrl }));
    } catch (err) {
      console.error("Resume upload failed", err);
    }
  };

  const handleProfilePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, profilePhoto: file }));
    }
  };

  const addSkill = (input) => {
    if (input.value.trim()) {
      setForm((prev) => ({
        ...prev,
        technicalSkills: [...prev.technicalSkills, input.value.trim()],
      }));
      input.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a new FormData object
    const formData = new FormData();
    
    // Process each form field
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
    
    // Make sure preferredDifficulty and preferredDuration are set only once
    // We don't need to append them again as they're already included in the form object
    // and processed in the loop above

    // Debugging output
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
for (let [key, value] of formData.entries()) {
  console.log(`${key}:`, value);
}

    try {
      // Use Vite's environment variable format
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      await axios.post(`${apiUrl}/user`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Profile saved successfully!");
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save profile.");
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto p-8 bg-white shadow-md rounded-lg">
      {/* Personal Information */}
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaUser /> Personal Information
        </h2>
        <div className="flex items-center justify-between mb-4">
          {/* Profile Photo */}
          <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-300">
            {form.profilePhoto ? (
              <img
                src={form.profilePhoto instanceof File ? URL.createObjectURL(form.profilePhoto) : form.profilePhoto}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400">
                <FaUser size={48} />
              </div>
            )}
          </div>

          {/* First & Last Name (wider) */}
          <div className="flex flex-col gap-2 ml-6 flex-1">
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="border border-gray-300 rounded-md px-3 py-2"
              required
            />
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
        </div>

        {/* Change Photo Button */}
        <div className="mt-2">
          <label
            htmlFor="photo-upload"
            className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded cursor-pointer"
          >
            Change Photo
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
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Location"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Experience</label>
            <select
              name="yearsOfExperience"
              value={form.yearsOfExperience}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
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
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaFilePdf /> Resume
        </h2>
        <p className="text-sm text-gray-600 mb-4">Upload your latest resume for AI-powered prep.</p>
        <div className="border-dashed border-2 border-gray-300 rounded-lg p-8 text-center">
          <FaFilePdf size={48} className="mx-auto text-gray-400" />
          <h3 className="text-lg font-medium mb-2">Upload Resume</h3>
          <p className="text-sm text-gray-600 mb-4">Drag and drop or click to browse</p>
          <div className="flex justify-center gap-4">
            <label
              htmlFor="resume-upload"
              className="bg-black text-white px-4 py-2 rounded-md cursor-pointer hover:bg-gray-800"
            >
              <FaUpload className="inline-block mr-2" /> Choose File
            </label>
            {form.resume && (
              <button
                type="button"
                onClick={() => window.open(form.resume)}
                className="bg-gray-200 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                <FaEye className="inline-block mr-2" /> View
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">PDF, DOC, DOCX (Max 5MB)</p>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            id="resume-upload"
            onChange={handleResumeUpload}
            className="hidden"
          />
        </div>

        {form.resume && (
          <div className="mt-4 bg-green-100 border border-green-300 rounded-md p-4 flex items-center justify-between">
            <div>
              <FaFilePdf className="text-red-500 mr-2 inline" />
              <span>{form.resume.split("/").pop()}</span>
              <p className="text-xs text-gray-500 mt-1">Uploaded • 1.2 MB</p>
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
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaCode /> Technical Skills
        </h2>
        <p className="text-sm text-gray-600 mb-4">Add skills to get relevant questions.</p>

        {/* Display Added Skills */}
        <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
          {form.technicalSkills.length === 0 ? (
            <span className="text-gray-400 text-sm italic">No skills added yet</span>
          ) : (
            form.technicalSkills.map((skill, index) => (
              <span
                key={index}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
              >
                {skill}
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      technicalSkills: prev.technicalSkills.filter((_, i) => i !== index),
                    }))
                  }
                  className="ml-1 text-red-500 hover:text-red-700 font-bold"
                >
                  ×
                </button>
              </span>
            ))
          )}
        </div>

        {/* Add Skill Input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add a skill (press Enter)"
            className="flex-grow border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                 
                handleTechnicalSkillsChange(e);
                const input = e.target;
                // if (input.value.trim()) {
                //   addSkill(input);
                // }
              }
            }}
          />
          <button
            type="button"
            onClick={() => {
              const input = document.querySelector('input[placeholder="Add a skill (press Enter)"]');
              addSkill(input);
            }}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-black"
          >
            Add
          </button>
        </div>
      </div>

      {/* Professional Background */}
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaBriefcase /> Professional Background
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Role</label>
            <input
              type="text"
              name="currentRole"
              value={form.currentRole}
              onChange={handleChange}
              placeholder="e.g. Frontend Developer"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Company</label>
            <input
              type="text"
              name="currentCompany"
              value={form.currentCompany}
              onChange={handleChange}
              placeholder="e.g. TechCorp"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Target Role</label>
          <input
            type="text"
            name="targetRole"
            value={form.targetRole}
            onChange={handleChange}
            placeholder="e.g. Senior Developer"
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Professional Summary</label>
          <textarea
            name="professionalSummary"
            value={form.professionalSummary}
            onChange={handleChange}
            placeholder="Tell us about your experience and goals..."
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 min-h-[100px]"
            required
          />
        </div>
      </div>

      {/* Education */}
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaGraduationCap /> Education
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Degree</label>
            <input
              type="text"
              name="degree"
              value={form.degree}
              onChange={handleChange}
              placeholder="e.g. B.Sc Computer Science"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Major</label>
            <input
              type="text"
              name="major"
              value={form.major}
              onChange={handleChange}
              placeholder="e.g. Software Engineering"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">University</label>
            <input
              type="text"
              name="university"
              value={form.university}
              onChange={handleChange}
              placeholder="e.g. Stanford"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Graduation Year</label>
            <input
              type="number"
              name="graduationYear"
              value={form.graduationYear}
              onChange={handleChange}
              placeholder="2020"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
        </div>
      </div>

      {/* Interview Preferences */}
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaSlidersH /> Interview Preferences
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Difficulty</label>
            <select
              name="preferredDifficulty"
              value={form.preferredDifficulty}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
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
            <label className="block text-sm font-medium text-gray-700">Duration</label>
            <select
              name="preferredDuration"
              value={form.preferredDuration}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
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
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Target Companies</label>
          <input
            type="text"
            name="targetCompanies"
            value={form.targetCompanies}
            onChange={handleChange}
            placeholder="Google, Meta, Amazon"
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
        </div>
      </div>
      {/* Save button */}
      <div className="flex justify-end mt-8 gap-3">
        <button
          type="button"
          onClick={() => alert("Changes discarded")}
          className="border border-gray-400 text-gray-700 px-5 py-2 rounded hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Profile;