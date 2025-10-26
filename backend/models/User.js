const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['employer', 'jobseeker'], required: true },
  profile: {
    bio: String,
    skills: [String],
    experience: String,
    resume: String, // URL to resume file
    profilePicture: String, // For job seekers
    company: String, // For employers
    logo: String, // For employers
  },
  views: { type: Number, default: 0 }, // For tracking profile views
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
