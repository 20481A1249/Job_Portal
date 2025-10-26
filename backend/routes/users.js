const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Ensure upload directories exist
const resumeDir = path.join(__dirname, '../uploads/resumes');
if (!fs.existsSync(resumeDir)) {
  fs.mkdirSync(resumeDir, { recursive: true });
}

const profilePictureDir = path.join(__dirname, '../uploads/profile-pictures');
if (!fs.existsSync(profilePictureDir)) {
  fs.mkdirSync(profilePictureDir, { recursive: true });
}

const logoDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(logoDir)) {
  fs.mkdirSync(logoDir, { recursive: true });
}

const router = express.Router();

// Configure multer for resume uploads
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/resumes/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const uploadResume = multer({ storage: resumeStorage });

// Configure multer for profile picture uploads
const profilePictureStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/profile-pictures/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const uploadProfilePicture = multer({ storage: profilePictureStorage });

// Configure multer for logo uploads
const logoStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const uploadLogo = multer({ storage: logoStorage });
const upload = multer();

// Get profile (authenticated user)
// Added GET route for fetching the logged-in user's profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update profile
router.put('/profile', auth, (req, res, next) => {
  if (req.user.role === 'jobseeker') {
    if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
      const upload = multer({
        storage: multer.diskStorage({
          destination: (req, file, cb) => {
            if (file.fieldname === 'resume') cb(null, 'uploads/resumes/');
            else if (file.fieldname === 'profilePicture') cb(null, 'uploads/profile-pictures/');
            else cb(null, 'uploads/');
          },
          filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
        }),
      }).fields([{ name: 'resume' }, { name: 'profilePicture' }]);
      upload(req, res, next);
    } else {
      next();
    }
  } else if (req.user.role === 'employer') {
    uploadLogo.single('logo')(req, res, next);
  } else {
    next();
  }
}, async (req, res) => {
  try {
    console.log('PUT /api/users/profile called');
    console.log('req.user:', req.user); // Debug: Check if req.user is populated
    console.log('req.body:', req.body); // Debug: Check request body
    console.log('req.file:', req.file); // Debug: Check uploaded file
    console.log('removeLogo:', req.body.removeLogo); // Debug: Check removeLogo flag

    const { name, bio, skills, experience, company } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate inputs
    if (name && typeof name !== 'string') return res.status(400).json({ message: 'Invalid name' });
    if (bio && typeof bio !== 'string') return res.status(400).json({ message: 'Invalid bio' });
    if (skills && typeof skills !== 'string') return res.status(400).json({ message: 'Invalid skills' });
    if (experience && typeof experience !== 'string') return res.status(400).json({ message: 'Invalid experience' });
    if (company && typeof company !== 'string') return res.status(400).json({ message: 'Invalid company' });

    // Update common fields
    if (name) user.name = name.trim();
    if (bio !== undefined) user.profile.bio = bio.trim();

    // Update role-specific fields
    if (req.user.role === 'jobseeker') {
      if (skills !== undefined) user.profile.skills = skills.split(',').map(s => s.trim()).filter(s => s);
      if (experience !== undefined) user.profile.experience = experience.trim();
      if (req.files) {
        if (req.files.resume && req.files.resume[0]) {
          user.profile.resume = '/' + req.files.resume[0].path.replace(/\\/g, '/').replace('backend/', ''); // Handle resume upload
        }
        if (req.files.profilePicture && req.files.profilePicture[0]) {
          user.profile.profilePicture = '/' + req.files.profilePicture[0].path.replace(/\\/g, '/').replace('backend/', ''); // Handle profile picture upload
        }
      }
    } else if (req.user.role === 'employer') {
      if (company !== undefined) user.profile.company = company.trim();
      if (req.file) user.profile.logo = req.file.path; // Handle logo upload
      if (req.body.removeLogo === 'true') {
        user.profile.logo = null; // Remove logo
      }
    }

    await user.save();
    console.log('Profile updated successfully');
    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

// Upload resume
router.post('/upload-resume', auth, uploadResume.single('resume'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.profile.resume = req.file.path;
    await user.save();
    res.json({ message: 'Resume uploaded', path: req.file.path });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete resume
router.delete('/resume', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.profile.resume = null;
    await user.save();
    res.json({ message: 'Resume deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get public profile
router.get('/profile/:id', async (req, res) => {
  try {
    console.log(`Fetching public profile for ID: ${req.params.id}`);
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(`User found: ${!!user}`);
    console.log(`Current views: ${user.views}`);

    // Only increment views if no_increment query param is not present
    if (!req.query.no_increment) {
      user.views += 1;
      console.log(`New views: ${user.views}`);
      await user.save();
      console.log('User saved successfully');
    } else {
      console.log('View increment skipped due to no_increment parameter');
    }

    // Return only name and profile fields
    res.json({
      name: user.name,
      profile: user.profile
    });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
