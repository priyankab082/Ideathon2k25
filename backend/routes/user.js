const express = require('express');
const router = express.Router();
const User = require('../models/user');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Create new user
    const newUser = new User({
      name,
      email,
      password, // Note: In a real app, you should hash this password
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

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    res.status(200).json({
      message: 'Login successful',
      user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get all users (admin only route in a real app)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
});

// Get user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error while fetching user' });
  }
});

// Update user
router.put('/users/:id', async (req, res) => {
  try {
    const { name, email, phone, role } = req.body;
    
    // Find and update user
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, role },
      { new: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error while updating user' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error while deleting user' });
  }
});

// Upload profile photo
router.post('/upload-profile-photo', upload.single('profilePhoto'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const photoUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({ photoUrl });
  } catch (error) {
    console.error('Error uploading profile photo:', error);
    res.status(500).json({ message: 'Server error during file upload' });
  }
});

// Get current user profile
router.get('/user', async (req, res) => {
  try {
    // In a real app, you would get the user ID from authentication middleware
    // For now, we'll return a mock user profile for testing
    const mockUserProfile = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "1234567890",
      location: "New York",
      yearsOfExperience: "3",
      resume: "/uploads/sample-resume.pdf",
      currentRole: "Software Developer",
      currentCompany: "Tech Corp",
      targetRole: "Senior Developer",
      professionalSummary: "Experienced software developer with 3 years of experience in web development.",
      technicalSkills: ["JavaScript", "React", "Node.js"],
      degree: "B.Sc Computer Science",
      major: "Software Engineering",
      university: "Tech University",
      graduationYear: "2020",
      preferredDifficulty: "medium",
      preferredDuration: "45 minutes",
      targetCompanies: ["Google", "Microsoft", "Amazon"],
      profilePhoto: "/uploads/sample-profile.jpg"
    };
    
    res.status(200).json(mockUserProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error while fetching user profile' });
  }
});

// Update user profile
router.post('/user', upload.single('profilePhoto'), async (req, res) => {
  try {
    // In a real app, you would get the user ID from authentication middleware
    // and update the user's profile in the database
    console.log('Profile update request received:', req.body);
    
    if (req.file) {
      console.log('Profile photo uploaded:', req.file.filename);
    }
    
    res.status(200).json({ 
      message: 'Profile updated successfully',
      // Return the data that was sent, simulating a successful update
      data: {
        ...req.body,
        profilePhoto: req.file ? `/uploads/${req.file.filename}` : req.body.profilePhotoUrl
      }
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error while updating user profile' });
  }
});

// Upload resume
router.post('/upload-resume', upload.single('resume'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const resumeUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({ resumeUrl });
  } catch (error) {
    console.error('Error uploading resume:', error);
    res.status(500).json({ message: 'Server error during file upload' });
  }
});

module.exports = router;