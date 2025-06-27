// backend/models/Complaint.js

const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  // The user (help seeker) who filed the complaint
  filedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Refers to the User model
    required: true
  },
  // The volunteer against whom the complaint is filed
  againstVolunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Also refers to the User model, specifically a user with role 'volunteer'
    required: true
  },
  // A brief title for the complaint
  title: {
    type: String,
    required: true,
    trim: true
  },
  // Detailed description of the complaint
  description: {
    type: String,
    required: true,
    trim: true
  },
  // Status of the complaint (e.g., 'pending', 'reviewed', 'resolved', 'dismissed')
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
    default: 'pending' // New complaints start as 'pending'
  },
  // Date when the complaint was filed
  filedAt: {
    type: Date,
    default: Date.now
  },
  // Optional: Date when the complaint was reviewed/resolved
  resolvedAt: {
    type: Date
  }
});

module.exports = mongoose.model('Complaint', ComplaintSchema);

