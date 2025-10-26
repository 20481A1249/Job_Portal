const express = require('express');
const SavedJob = require('../models/SavedJob');
const auth = require('../middleware/auth');

const router = express.Router();

// Get saved jobs for authenticated user
router.get('/', auth, async (req, res) => {
  if (req.user.role !== 'jobseeker') return res.status(403).json({ message: 'Access denied' });

  try {
    const savedJobs = await SavedJob.find({ user: req.user.id }).populate('job');
    res.json(savedJobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Save a job
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'jobseeker') return res.status(403).json({ message: 'Access denied' });

  try {
    const { job } = req.body;
    const savedJob = new SavedJob({ user: req.user.id, job });
    await savedJob.save();
    res.status(201).json(savedJob);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get saved jobs for user
router.get('/user/:userId', auth, async (req, res) => {
  if (req.user.id !== req.params.userId) return res.status(403).json({ message: 'Access denied' });

  try {
    const savedJobs = await SavedJob.find({ user: req.params.userId }).populate('job');
    res.json(savedJobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove saved job
router.delete('/:id', auth, async (req, res) => {
  try {
    const savedJob = await SavedJob.findById(req.params.id);
    if (savedJob.user.toString() !== req.user.id) return res.status(403).json({ message: 'Access denied' });

    await SavedJob.findByIdAndDelete(req.params.id);
    res.json({ message: 'Saved job removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
