// backend/models/VolunteerProfile.js

const mongoose = require('mongoose'); // Mongoose to define the schema

const VolunteerProfileSchema = new mongoose.Schema({
  // The user ID associated with this volunteer profile
  user: {
    type: mongoose.Schema.Types.ObjectId, // This stores the ID of the User
    ref: 'User', // It refers to the 'User' model
    required: true,
    unique: true // Each user (volunteer) can only have one profile
  },
  // A brief bio or introduction for the volunteer
  bio: {
    type: String,
    required: true,
    maxlength: 500 // Limit the length of the bio
  },
  // List of skills the volunteer possesses (e.g., 'Driving', 'Cooking', 'Tutoring')
  skills: {
    type: [String], // Array of strings
    required: true // Must provide at least one skill
  },
  // Volunteer's availability (e.g., 'Weekends', 'Evenings', 'Full-time')
  availability: {
    type: [String], // Array of strings
    required: true // Must provide availability
  },
  // Location information (optional, for matching purposes)
  location: {
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zipCode: { type: String, trim: true }
  },
  // Date when the profile was created or last updated
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('VolunteerProfile', VolunteerProfileSchema);

