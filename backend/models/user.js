// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, default: 'user' },

  // Extended Profile Fields
  firstName: { type: String },
  lastName: { type: String },
  location: { type: String },
  yearsOfExperience: { type: String },
  resume: { type: String }, // URL to resume file
  currentRole: { type: String },
  currentCompany: { type: String },
  targetRole: { type: String },
  professionalSummary: { type: String },
  technicalSkills: [{ type: String }],
  degree: { type: String },
  major: { type: String },
  university: { type: String },
  graduationYear: { type: Number },
  preferredDifficulty: { type: String },
  preferredDuration: { type: String },
  targetCompanies: [{ type: String }],
  profilePhoto: { type: String }, // URL to photo
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);