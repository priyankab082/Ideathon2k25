// routes/user.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Extended model below
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Optional: for auth later

// =======================
// Multer File Upload Setup
// =======================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'resume') {
      cb(null, path.join(__dirname, '../uploads/resumes'));
    } else if (file.fieldname === 'profilePhoto') {
      cb(null, path.join(__dirname, '../uploads/photos'));
    } else {
      cb(null, path.join(__dirname, '../uploads'));
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// =======================
// Helper: Parse Array Fields from FormData
// =======================
const parseArrayField = (field) => {
  if (!field) return [];
  try {
    return Array.isArray(field) ? field : field.split(',').map(item => item.trim()).filter(Boolean);
  } catch {
    return [];
  }
};

// =======================
// Register User
// =======================
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      role: role || 'user'
    });

    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// =======================
// Login User
// =======================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // In real app: generate JWT
    // const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// =======================
// Get All Users (Admin)
// =======================
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// =======================
// Get User by ID
// =======================
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// =======================
// Update User (Basic Info)
// =======================
router.put('/users/:id', async (req, res) => {
  try {
    const { name, email, phone, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, role },
      { new: true }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      message: 'User updated',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user' });
  }
});

// =======================
// Delete User
// =======================
router.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// =======================
// Upload Profile Photo
// =======================
router.post('/upload-profile-photo', upload.single('profilePhoto'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No photo uploaded' });
  const photoUrl = `/uploads/photos/${req.file.filename}`;
  res.status(200).json({ photoUrl });
});

// =======================
// Upload Resume
// =======================
router.post('/upload-resume', upload.single('resume'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No resume uploaded' });
  const resumeUrl = `/uploads/resumes/${req.file.filename}`;
  res.status(200).json({ resumeUrl });
});

// =======================
// GET: Current User Profile
// =======================
router.get('/user', async (req, res) => {
  try {
    // Simulate user from auth middleware (in real app: req.user from JWT)
    const email = req.query.email; // or use JWT: req.user.email
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Return full profile data
    res.status(200).json({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email,
      phone: user.phone || '',
      location: user.location || '',
      yearsOfExperience: user.yearsOfExperience || '',
      resume: user.resume || '',
      currentRole: user.currentRole || '',
      currentCompany: user.currentCompany || '',
      targetRole: user.targetRole || '',
      professionalSummary: user.professionalSummary || '',
      technicalSkills: user.technicalSkills || [],
      degree: user.degree || '',
      major: user.major || '',
      university: user.university || '',
      graduationYear: user.graduationYear || '',
      preferredDifficulty: user.preferredDifficulty || '',
      preferredDuration: user.preferredDuration || '',
      targetCompanies: user.targetCompanies?.join(', ') || '',
      profilePhoto: user.profilePhoto || ''
    });
  } catch (error) {
    console.error('Fetch profile error:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
});

// =======================
// POST: Save Full User Profile
// =======================
router.post('/user', upload.single('profilePhoto'), async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      location,
      yearsOfExperience,
      currentRole,
      currentCompany,
      targetRole,
      professionalSummary,
      technicalSkills,
      degree,
      major,
      university,
      graduationYear,
      preferredDifficulty,
      preferredDuration,
      targetCompanies,
      resume,
      profilePhotoUrl
    } = req.body;

    // Find user by email
    let user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Handle arrays
    const skills = parseArrayField(technicalSkills);
    const companies = parseArrayField(targetCompanies);

    // Build profile update object
    const profileUpdates = {
      firstName,
      lastName,
      phone,
      location,
      yearsOfExperience,
      currentRole,
      currentCompany,
      targetRole,
      professionalSummary,
      technicalSkills: skills,
      degree,
      major,
      university,
      graduationYear: parseInt(graduationYear, 10) || undefined,
      preferredDifficulty,
      preferredDuration,
      targetCompanies: companies
    };

    // Only update resume if passed
    if (resume) profileUpdates.resume = resume;

    // Handle profile photo
    if (req.file) {
      profileUpdates.profilePhoto = `/uploads/photos/${req.file.filename}`;
    } else if (profilePhotoUrl && !req.file) {
      profileUpdates.profilePhoto = profilePhotoUrl;
    }

    // Update user
    Object.assign(user, profileUpdates);
    await user.save();

    res.status(200).json({
      message: 'Profile saved successfully',
      profile: {
        ...user.toObject(),
        password: undefined // Don't send password
      }
    });
  } catch (error) {
    console.error('Profile save error:', error);
    res.status(500).json({ message: 'Failed to save profile' });
  }
});

module.exports = router;