// backend/models/Review.js
// This file defines the blueprint (schema) for how review data
// will be stored in our MongoDB database.

const mongoose = require('mongoose'); // Import mongoose to define the schema

// Define the Review Schema
const ReviewSchema = new mongoose.Schema({
  // The help request that this review pertains to
  helpRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HelpRequest', // Refers to the HelpRequest model
    required: true,
    unique: true // Each help request can only have one review
  },
  // The user who wrote the review (the Help Seeker)
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Refers to the User model
    required: true
  },
  // The volunteer who is being reviewed
  reviewedVolunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Refers to the User model
    required: true
  },
  // The rating given (e.g., 1 to 5 stars)
  rating: {
    type: Number,
    required: true,
    min: 1, // Minimum rating value
    max: 5 // Maximum rating value
  },
  // Optional comment from the reviewer
  comment: {
    type: String,
    trim: true,
    maxlength: 500 // Limit comment length
  },
  // Date when the review was created
  createdAt: {
    type: Date,
    default: Date.now // Automatically sets the current date/time
  }
});

module.exports = mongoose.model('Review', ReviewSchema);

