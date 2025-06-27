// backend/routes/volunteer.js
// This file defines API routes specifically for Volunteer users.
// It includes functionalities for volunteers to view and accept help requests,
// manage the status of requests they have accepted, and now manage their own profiles.

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Our authentication middleware
const HelpRequest = require('../models/HelpRequest'); // Import HelpRequest model
const User = require('../models/User'); // Import User model (to populate user details)
const VolunteerProfile = require('../models/VolunteerProfile'); // NEW: Import VolunteerProfile model

/**
 * @route GET /api/volunteer/requests
 * @description Get all pending and accepted requests relevant to a volunteer.
 * For 'pending' requests, it should show those not yet accepted by anyone.
 * For 'accepted' requests, it should show those accepted by the current volunteer.
 * @access Private (Volunteer only)
 */
router.get('/requests', auth, async (req, res) => {
  // Check if the authenticated user is a volunteer
  if (req.user.role !== 'volunteer') {
    return res.status(403).json({ msg: 'Access denied. Not a volunteer.' });
  }

  try {
    // Find requests that are either:
    // 1. Pending (not yet assigned to anyone)
    // 2. Accepted by the current volunteer (req.user.id)
    const requests = await HelpRequest.find({
      $or: [
        { status: 'pending' },
        { assignedVolunteer: req.user.id }
      ]
    })
    .populate('user', ['name', 'email']) // Populate help seeker's name and email
    .populate('assignedVolunteer', ['name', 'email']) // Populate assigned volunteer's name and email
    .sort({ createdAt: -1 }); // Sort by most recent first

    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error fetching volunteer requests');
  }
});

/**
 * @route PUT /api/volunteer/requests/:id/accept
 * @description Volunteer accepts a pending help request.
 * @access Private (Volunteer only)
 */
router.put('/requests/:id/accept', auth, async (req, res) => {
  // Check if the authenticated user is a volunteer
  if (req.user.role !== 'volunteer') {
    return res.status(403).json({ msg: 'Access denied. Not a volunteer.' });
  }

  try {
    let request = await HelpRequest.findById(req.params.id);

    // Check if request exists
    if (!request) {
      return res.status(404).json({ msg: 'Help request not found' });
    }

    // Check if the request is pending
    if (request.status !== 'pending') {
      return res.status(400).json({ msg: 'Request is not pending and cannot be accepted.' });
    }

    // Check if the request is already assigned to someone else
    if (request.assignedVolunteer && request.assignedVolunteer.toString() !== req.user.id) {
        return res.status(400).json({ msg: 'This request has already been accepted by another volunteer.' });
    }
    
    // Update request status to 'accepted' and assign the volunteer
    request.status = 'accepted';
    request.assignedVolunteer = req.user.id; // Assign the current volunteer's ID

    await request.save();
    res.json({ msg: 'Request accepted successfully!', request });

  } catch (err) {
    console.error(err.message);
    // If id is not a valid ObjectId, Mongoose will throw a CastError
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Request not found (invalid ID format).' });
    }
    res.status(500).send('Server Error accepting request');
  }
});


/**
 * @route PUT /api/volunteer/requests/:id/status
 * @description Update the status of an accepted request (e.g., to 'completed' or 'cancelled')
 * @access Private (Volunteer only)
 */
router.put('/requests/:id/status', auth, async (req, res) => {
  // Check if the authenticated user is a volunteer
  if (req.user.role !== 'volunteer') {
    return res.status(403).json({ msg: 'Access denied. Not a volunteer.' });
  }

  const { status } = req.body; // New status (e.g., 'completed', 'cancelled')

  // Validate the new status
  const validStatuses = ['completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ msg: 'Invalid status provided.' });
  }

  try {
    let request = await HelpRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ msg: 'Help request not found' });
    }

    // Ensure the volunteer is the one assigned to this request
    if (request.assignedVolunteer.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to update this request.' });
    }

    // Prevent updating if already completed or cancelled by volunteer
    if (request.status === 'completed' || request.status === 'cancelled') {
        return res.status(400).json({ msg: `Request already ${request.status}. No further updates allowed.` });
    }

    // Update status
    request.status = status;
    await request.save();

    res.json({ msg: `Request status updated to ${status}.`, request });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Request not found (invalid ID format).' });
    }
    res.status(500).send('Server Error updating request status');
  }
});

/**
 * @route GET /api/volunteer/profile/me
 * @description Get current volunteer's profile
 * @access Private (Volunteer only)
 */
router.get('/profile/me', auth, async (req, res) => {
  if (req.user.role !== 'volunteer') {
    return res.status(403).json({ msg: 'Access denied. Not a volunteer.' });
  }

  try {
    const profile = await VolunteerProfile.findOne({ user: req.user.id }).populate('user', ['name', 'email']);

    if (!profile) {
      // If no profile exists, but user is volunteer, return a message
      return res.status(404).json({ msg: 'Volunteer profile not found for this user.' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error fetching volunteer profile');
  }
});

/**
 * @route POST /api/volunteer/profile
 * @description Create or update volunteer profile
 * @access Private (Volunteer only)
 */
router.post('/profile', auth, async (req, res) => {
  if (req.user.role !== 'volunteer') {
    return res.status(403).json({ msg: 'Access denied. Not a volunteer.' });
  }

  const { bio, skills, availability, location } = req.body;

  // Basic validation (can be expanded with express-validator)
  if (!bio || !skills || skills.length === 0 || !availability || availability.length === 0) {
    return res.status(400).json({ msg: 'Please fill in all required profile fields (Bio, Skills, Availability).' });
  }

  const profileFields = {
    user: req.user.id,
    bio,
    skills,
    availability,
    location: {}
  };

  // Build location object if provided
  if (location) {
    if (location.address) profileFields.location.address = location.address;
    if (location.city) profileFields.location.city = location.city;
    if (location.state) profileFields.location.state = location.state;
    if (location.zipCode) profileFields.location.zipCode = location.zipCode;
  }

  try {
    let profile = await VolunteerProfile.findOne({ user: req.user.id });

    if (profile) {
      // Update existing profile
      profile = await VolunteerProfile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true } // Return the updated document
      );
      return res.json({ msg: 'Volunteer profile updated!', profile });
    }

    // Create new profile if none exists
    profile = new VolunteerProfile(profileFields);
    await profile.save();
    res.json({ msg: 'Volunteer profile created!', profile });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error saving volunteer profile');
  }
});


module.exports = router;
