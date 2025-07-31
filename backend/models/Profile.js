// models/Profile.js
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  yearsOfExperience: { type: String, required: true }, // e.g., "fresher", "3"
  resume: { type: String }, // URL to the uploaded resume (e.g., in /uploads/resumes/)
  currentRole: { type: String, required: true },
  currentCompany: { type: String, required: true },
  targetRole: { type: String, required: true },
  professionalSummary: { type: String, required: true },
  technicalSkills: [{ type: String }], // Array of strings
  degree: { type: String, required: true },
  major: { type: String, required: true },
  university: { type: String, required: true },
  graduationYear: { type: Number, required: true },
  preferredDifficulty: { type: String, required: true }, // easy, medium, hard
  preferredDuration: { type: String, required: true }, // e.g., "30 minutes"
  targetCompanies: [{ type: String }], // Array of company names
  profilePhoto: { type: String }, // URL to profile photo
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);