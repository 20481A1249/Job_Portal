const express = require('express');
const fs = require('fs');
const path = require('path');
const Job = require('../models/Job');
const JobApplication = require('../models/JobApplication');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const { category, location, company } = req.query;
    let filter = { status: { $in: ['active', 'closed'] } }; // Show active and closed jobs to job seekers
    if (category) filter.category = category;
    if (location) filter.location = location;
    if (company) filter.company = company;

    const jobs = await Job.find(filter).populate('employer', 'name profile.company');
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my jobs (for authenticated employer)
router.get('/my-jobs', auth, async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user.id }).populate({
      path: 'applicationCount'
    });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('employer', 'name profile.company');
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create job (employers only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'employer') return res.status(403).json({ message: 'Access denied' });

  try {
    const jobData = { ...req.body, employer: req.user.id };

    // Handle logo upload
    if (req.file) {
      jobData.logo = `/uploads/${req.file.filename}`;
    } else if (!jobData.logo) {
      // If no logo provided, use employer's logo from profile
      const User = require('../models/User');
      const employer = await User.findById(req.user.id);
      if (employer && employer.profile && employer.profile.logo) {
        jobData.logo = employer.profile.logo;
      }
    }

    const job = new Job(jobData);
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update job (employers only)
router.put('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (job.employer.toString() !== req.user.id) return res.status(403).json({ message: 'Access denied' });

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedJob);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update job status (employers only)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (job.employer.toString() !== req.user.id) return res.status(403).json({ message: 'Access denied' });

    const { status } = req.body;
    if (!['draft', 'active', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(updatedJob);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete job (employers only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (job.employer.toString() !== req.user.id) return res.status(403).json({ message: 'Access denied' });

    // Delete job logo if it exists
    if (job.logo && job.logo.startsWith('/uploads/')) {
      const logoPath = path.join(__dirname, '..', job.logo);
      fs.unlink(logoPath, (err) => {
        if (err) console.error('Error deleting logo:', err);
      });
    }

    // Get all applications for this job to delete their resumes
    const applications = await JobApplication.find({ job: req.params.id });

    // Delete all associated job applications and their resumes
    for (const application of applications) {
      if (application.resume) {
        const resumePath = path.join(__dirname, '..', application.resume);
        fs.unlink(resumePath, (err) => {
          if (err) console.error('Error deleting resume:', err);
        });
      }
    }

    // Delete all associated job applications
    await JobApplication.deleteMany({ job: req.params.id });

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get jobs by employer
router.get('/employer/:id', async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.params.id });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;
