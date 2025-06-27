// backend/models/HelpRequest.js
// This file defines the blueprint (schema) for how help request data
// will be stored in our MongoDB database.

const mongoose = require('mongoose'); // Import mongoose to define the schema

// Define the HelpRequest Schema
const HelpRequestSchema = new mongoose.Schema({
  // The user who created this request (a Help Seeker)
  user: {
    type: mongoose.Schema.Types.ObjectId, // This stores the ID of the User model
    ref: 'User', // It refers to the 'User' model
    required: true // A request must be associated with a user
  },
  // The title or a short summary of the help needed
  title: {
    type: String,
    required: true,
    trim: true, // Remove whitespace from both ends of a string
    maxlength: 100 // Limit title length
  },
  // A detailed description of the help required
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000 // Limit description length
  },
  // Category of the help request (e.g., 'Groceries', 'Transport', 'Emotional Support')
  category: {
    type: String,
    enum: ['Groceries', 'Transport', 'Emotional Support', 'Errands', 'Other'], // Predefined categories
    default: 'Other',
    required: true
  },
  // Current status of the request:
  // 'pending': waiting for a volunteer to accept
  // 'accepted': a volunteer has accepted
  // 'completed': the request has been fulfilled
  // 'cancelled': the request was cancelled by the help seeker or admin
  status: {
    type: String,
    enum: ['pending', 'accepted', 'completed', 'cancelled'],
    default: 'pending'
  },
  // The volunteer who accepted this request (optional)
  assignedVolunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Refers to the 'User' model (role 'volunteer')
    // Not required, as it's initially pending
  },
  // Flag to indicate if a review has been left for this request
  hasReview: {
    type: Boolean,
    default: false
  },
  // Date when the request was created
  createdAt: {
    type: Date,
    default: Date.now // Automatically sets the current date/time
  }
});

module.exports = mongoose.model('HelpRequest', HelpRequestSchema);

