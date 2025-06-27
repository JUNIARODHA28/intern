// backend/models/User.js
// This file defines the blueprint (schema) for how user data will be stored in our MongoDB database.

const mongoose = require('mongoose'); // We need mongoose to create our schema (template)

// Define the User Schema (our template for a user)
const UserSchema = new mongoose.Schema({
  // The user's name (e.g., "Alice Smith")
  name: {
    type: String, // Data type is text
    required: true // This field must be provided when creating a user
  },
  // The user's email address, used for login and identification
  email: {
    type: String,
    required: true, // Must be provided
    unique: true // Each email must be unique; no two users can have the same email
  },
  // NEW: The user's contact number
  contactNumber: {
    type: String,
    required: false, // Make it required based on your frontend validation, but keeping false for flexibility here
    trim: true,      // Remove whitespace
    // You might add a 'match' regex here for server-side validation if needed
  },
  // The user's password (will be stored as a hashed/encrypted string for security)
  password: {
    type: String,
    required: true // Must be provided
  },
  // The role of the user, which determines what they can do in the application
  role: {
    type: String,
    enum: ['volunteer', 'help_seeker', 'admin'], // 'enum' means it can only be one of these specific values
    default: 'help_seeker' // If no role is specified during creation, it defaults to 'help_seeker'
  },
  // The date when the user account was created
  date: {
    type: Date,
    default: Date.now // Automatically sets the current date/time when a new user is created
  }
});

// Export the User model so it can be used in other parts of our backend (e.g., routes)
module.exports = mongoose.model('User', UserSchema);

