const express = require('express');
const multer = require('multer');
const path = require('path');
const JobApplication = require('../models/JobApplication');
const Job = require('../models/Job');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for resume uploads in applications
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/resumes/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const uploadResume = multer({ storage: resumeStorage });

// Apply for job
router.post('/:jobId', auth, uploadResume.single('resume'), async (req, res) => {
  if (req.user.role !== 'jobseeker') return res.status(403).json({ message: 'Access denied' });

  try {
    const jobId = req.params.jobId;
    // Check if user has already applied for this job
    const existingApplication = await JobApplication.findOne({ job: jobId, applicant: req.user.id });
    if (existingApplication) return res.status(400).json({ message: 'You have already applied for this job' });

    const resume = req.file ? req.file.path : null;
    const application = new JobApplication({ job: jobId, applicant: req.user.id, resume });
    await application.save();
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get applications for a job (employers only)
router.get('/job/:jobId', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (job.employer.toString() !== req.user.id) return res.status(403).json({ message: 'Access denied' });

    const applications = await JobApplication.find({ job: req.params.jobId }).populate('applicant', 'name email profile').populate('job', 'title company logo');
    // Ensure resume path is accessible
    const applicationsWithResumeUrl = applications.map(app => ({
      ...app.toObject(),
      resume: app.resume ? `http://localhost:5000/${app.resume}` : null
    }));
    res.json(applicationsWithResumeUrl);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user's applications
router.get('/user/:userId', auth, async (req, res) => {
  if (req.user.id !== req.params.userId && req.params.userId !== 'me') return res.status(403).json({ message: 'Access denied' });

  try {
    const userId = req.params.userId === 'me' ? req.user.id : req.params.userId;
    const applications = await JobApplication.find({ applicant: userId }).populate('job', 'title company location description logo');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update application status (employers only)
router.put('/:id', auth, async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id).populate('job');
    if (application.job.employer.toString() !== req.user.id) return res.status(403).json({ message: 'Access denied' });

    const updatedApplication = await JobApplication.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(updatedApplication);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// View resume (employers only)
router.get('/:id/resume', auth, async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id).populate('job');
    if (application.job.employer.toString() !== req.user.id) return res.status(403).json({ message: 'Access denied' });

    if (!application.resume) return res.status(404).json({ message: 'Resume not found' });

    const filePath = path.join(__dirname, '..', application.resume);
    console.log('Attempting to serve file:', filePath);
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).json({ message: 'Error serving file' });
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
