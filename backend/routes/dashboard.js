const express = require('express');
const Job = require('../models/Job');
const JobApplication = require('../models/JobApplication');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get public analytics for landing page
router.get('/public', async (req, res) => {
  try {
    const jobsPosted = await Job.countDocuments();
    const activeUsers = await User.countDocuments();
    const companies = await User.countDocuments({ role: 'employer' });
    const totalApplications = await JobApplication.countDocuments();
    const successfulApplications = await JobApplication.countDocuments({ status: 'accepted' });
    const successRate = totalApplications > 0 ? Math.round((successfulApplications / totalApplications) * 100) : 0;

    res.json({
      jobsPosted,
      activeUsers,
      companies,
      successRate: `${successRate}%`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get dashboard analytics (employers only)
router.get('/analytics', auth, async (req, res) => {
  if (req.user.role !== 'employer') return res.status(403).json({ message: 'Access denied' });

  try {
    const jobsPosted = await Job.countDocuments({ employer: req.user.id });
    const applicationsReceived = await JobApplication.countDocuments({ job: { $in: await Job.find({ employer: req.user.id }).select('_id') } });
    const activeJobs = await Job.countDocuments({ employer: req.user.id, status: 'open' });

    res.json({
      jobsPosted,
      applicationsReceived,
      activeJobs,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get employer dashboard stats
router.get('/employer', auth, async (req, res) => {
  if (req.user.role !== 'employer') return res.status(403).json({ message: 'Access denied' });

  try {
    const jobs = await Job.countDocuments({ employer: req.user.id });
    const applications = await JobApplication.countDocuments({ job: { $in: await Job.find({ employer: req.user.id }).select('_id') } });
    const user = await User.findById(req.user.id);
    const views = user ? user.views : 0;

    res.json({
      jobs,
      applications,
      views,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
