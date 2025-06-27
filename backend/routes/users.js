// backend/routes/users.js
// This file defines API routes related to general user information,
// specifically for fetching lists of users based on roles (e.g., volunteers).

const express = require('express');
const router = express.Router();
// Import the User model from its definition file. DO NOT redefine it here.
const User = require('../models/User');
const auth = require('../middleware/auth'); // Our authentication middleware

/**
 * @route GET /api/users/volunteers
 * @description Get a list of all users with the 'volunteer' role.
 * @access Private (Accessible to any logged-in user to allow help seekers to see volunteers)
 */
router.get('/volunteers', auth, async (req, res) => {
  try {
    console.log('Fetching all volunteers...');
    // Find all users where the role is 'volunteer'
    // Exclude the password field for security
    const volunteers = await User.find({ role: 'volunteer' }).select('-password');
    console.log(`Found ${volunteers.length} volunteers.`);
    res.json(volunteers);
  } catch (err) {
    console.error('Error fetching volunteers:', err.message);
    console.error('Full Error Stack:', err.stack); // Log full stack for debugging
    res.status(500).send('Server Error fetching volunteers');
  }
});

/**
 * @route GET /api/users/:id/profile
 * @description Get a single volunteer's public profile details.
 * @access Private (Accessible to any logged-in user)
 * This route fetches user details and (if applicable) their associated VolunteerProfile.
 */
router.get('/:id/profile', auth, async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(`Fetching profile for user ID: ${userId}`);

    // Fetch the user by ID, excluding password
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // If the user is a volunteer, attempt to fetch their associated profile
    let volunteerProfile = null;
    if (user.role === 'volunteer') {
      const VolunteerProfile = require('../models/VolunteerProfile'); // Ensure correct path
      volunteerProfile = await VolunteerProfile.findOne({ user: userId });
      console.log(`Volunteer profile found for ${user.name}:`, volunteerProfile ? 'Yes' : 'No');
    }

    // Return user details and their profile (if found)
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      profile: volunteerProfile // This will be null if not a volunteer or no profile exists
    });

  } catch (err) {
    console.error('Error fetching user profile:', err.message);
    console.error('Full Error Stack:', err.stack);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found (invalid ID format).' });
    }
    res.status(500).send('Server Error fetching user profile');
  }
});


module.exports = router;
