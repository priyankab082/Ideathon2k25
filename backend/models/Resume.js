// models/Resume.js
const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  // User's full name (you can split into first/last if needed)
  userName: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Resume', resumeSchema);