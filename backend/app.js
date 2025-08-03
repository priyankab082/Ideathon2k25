require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const Resume=require("./models/Resume")
const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const userRoutes = require("./routes/user");
app.use("/api", userRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// const multer = require('multer');

// // Set up storage for uploaded files
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDir = 'uploads';
//     // Create folder if it doesn't exist
//     const fs = require('fs');
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }
//     cb(null, uploadDir); // Save files to 'uploads/' folder
//   },
//   filename: (req, file, cb) => {
//     // Generate unique filename: e.g., 1754249296415-resume.pdf
//     const uniqueName = `${Date.now()}-${file.originalname}`;
//     cb(null, uniqueName);
//   },
// });

// // Initialize multer with storage config
// const upload = multer({ storage });


// app.post('/upload-resume', upload.single('resume'), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: 'No file uploaded' });
//   }

//   const { path: filePath, originalname, mimetype } = req.file;

//   // Get user name from request body
//   const { userName } = req.body;
//   if (!userName) {
//     return res.status(400).json({ error: 'User name is required' });
//   }

//   try {
//     const extractedText = await extractTextFromFile(filePath, mimetype);

//     const resume = new Resume({
//       userName,           // Save the user's name
//       filename: originalname,
//       content: extractedText,
//     });
//     await resume.save();

//     const fileUrl = `${process.env.API_URL}/uploads/${req.file.filename}`;

//     res.json({
//       message: 'Resume uploaded and parsed successfully',
//       resumeUrl: fileUrl,
//       filename: originalname,
//       extractedLength: extractedText.length,
//       resumeId: resume._id,
//     });
//   } catch (error) {
//     console.error('Error processing resume:', error);
//     res.status(500).json({ error: 'Failed to process resume: ' + error.message });
//   }
// });
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});
