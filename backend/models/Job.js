const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  salary: { type: Number },
  type: { type: String, enum: ['full-time', 'part-time', 'contract'], default: 'full-time' },
  requirements: [String],
  employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['active', 'closed', 'draft'], default: 'draft' },
  logo: { type: String }, // Path to company logo
  createdAt: { type: Date, default: Date.now },
});

// Virtual for application count
jobSchema.virtual('applicationCount', {
  ref: 'JobApplication',
  localField: '_id',
  foreignField: 'job',
  count: true
});

// Ensure virtual fields are serialized
jobSchema.set('toJSON', { virtuals: true });
jobSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Job', jobSchema);
