// backend/routes/api/requests.js
// This file defines API routes for handling help requests, accessible by various user roles.

const express = require('express');
const router = express.Router(); // Create an Express router
const auth = require('../middleware/auth'); // Import authentication middleware
const { check, validationResult } = require('express-validator'); // For input validation

const HelpRequest = require('../models/HelpRequest'); // Import the HelpRequest Mongoose model
const User = require('../models/User'); // Import the User Mongoose model (Corrected path relative to requests.js)

// @route   POST api/requests
// @desc    Create a help request (Help Seeker only)
// @access  Private (requires authentication)
router.post(
  '/',
  [
    auth, // Apply authentication middleware
    // Input validation for request fields
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('category', 'Please select a valid category').isIn(['Groceries', 'Transport', 'Emotional Support', 'Errands', 'Other']),
    check('urgency', 'Please select a valid urgency').isIn(['low', 'medium', 'high'])
  ],
  async (req, res) => {
    // Check for validation errors from express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Find the user who is creating the request
      const user = await User.findById(req.user.id).select('-password'); // Exclude password from user object

      // Check if the authenticated user is a 'help_seeker'
      if (user.role !== 'help_seeker') {
        return res.status(403).json({ msg: 'Only help seekers can create requests.' });
      }

      // Create a new HelpRequest instance using data from the request body
      const newRequest = new HelpRequest({
        user: req.user.id, // User ID from the authenticated token
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        urgency: req.body.urgency,
        status: 'pending' // Default status is pending
      });

      // Save the new request to the database
      const request = await newRequest.save();
      res.json({ msg: 'Help request created successfully!', request });

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/requests
// @desc    Get all help requests (Accessible by any authenticated user for browsing)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Find all help requests and populate the 'user' and 'assignedVolunteer' fields
    // with selected user information (name and email)
    const requests = await HelpRequest.find()
      .populate('user', ['name', 'email'])
      .populate('assignedVolunteer', ['name', 'email'])
      .sort({ createdAt: -1 }); // Sort by creation date, newest first
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/requests/me
// @desc    Get current user's (Help Seeker's) help requests
// @access  Private (Help Seeker only)
router.get('/me', auth, async (req, res) => {
  try {
    // Find requests where the 'user' field matches the authenticated user's ID
    // Populate 'assignedVolunteer' info
    const requests = await HelpRequest.find({ user: req.user.id })
      .populate('assignedVolunteer', ['name', 'email'])
      .sort({ createdAt: -1 });

    // Check if the authenticated user is actually a help seeker (optional, but good for strictness)
    const user = await User.findById(req.user.id);
    if (user.role !== 'help_seeker') {
      return res.status(403).json({ msg: 'Access denied. Only help seekers can view their own requests.' });
    }

    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/requests/pending
// @desc    Get all pending help requests (for Volunteers to browse)
// @access  Private (Volunteer only)
router.get('/pending', auth, async (req, res) => {
  try {
    // Find all requests with status 'pending' and no assigned volunteer
    const pendingRequests = await HelpRequest.find({ status: 'pending', assignedVolunteer: { $eq: null } })
      .populate('user', ['name', 'email']) // Populate the user who made the request
      .sort({ createdAt: -1 });

    // Check if the authenticated user is a 'volunteer'
    const user = await User.findById(req.user.id);
    if (user.role !== 'volunteer') {
      return res.status(403).json({ msg: 'Access denied. Only volunteers can view pending requests.' });
    }

    res.json(pendingRequests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/requests/assigned-to-me
// @desc    Get requests assigned to the current authenticated volunteer
// @access  Private (Volunteer only)
router.get('/assigned-to-me', auth, async (req, res) => {
  try {
    // Ensure the authenticated user is a volunteer
    const user = await User.findById(req.user.id);
    if (user.role !== 'volunteer') {
      return res.status(403).json({ msg: 'Access denied. Only volunteers can view assigned requests.' });
    }

    // Find requests where the assignedVolunteer field matches the authenticated volunteer's ID
    // Include requests that are 'accepted' or 'completed'
    const assignedRequests = await HelpRequest.find({
      assignedVolunteer: req.user.id,
      status: { $in: ['accepted', 'completed'] } // Include accepted and completed requests
    })
      .populate('user', ['name', 'email']) // Populate the user who made the request
      .sort({ createdAt: -1 });

    res.json(assignedRequests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   PUT api/requests/:id/accept
// @desc    Volunteer accepts a pending help request
// @access  Private (Volunteer only)
router.put('/:id/accept', auth, async (req, res) => {
  try {
    const request = await HelpRequest.findById(req.params.id);

    // Check if request exists
    if (!request) {
      return res.status(404).json({ msg: 'Request not found' });
    }

    // Check if the request is already accepted or completed/cancelled
    if (request.status !== 'pending') {
      return res.status(400).json({ msg: `Request is already ${request.status}.` });
    }

    // Check if the user is a volunteer
    const user = await User.findById(req.user.id);
    if (user.role !== 'volunteer') {
      return res.status(403).json({ msg: 'Only volunteers can accept requests.' });
    }

    // Assign the volunteer and update status
    request.assignedVolunteer = req.user.id;
    request.status = 'accepted';
    await request.save();

    res.json({ msg: 'Request accepted successfully!', request });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/requests/:id/complete
// @desc    Volunteer marks an accepted request as completed
// @access  Private (Assigned Volunteer only)
router.put('/:id/complete', auth, async (req, res) => {
  try {
    const request = await HelpRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ msg: 'Request not found' });
    }

    // Check if the request is in 'accepted' status
    if (request.status !== 'accepted') {
      return res.status(400).json({ msg: 'Request must be accepted to be marked as completed.' });
    }

    // Ensure the volunteer marking it complete is the assigned volunteer
    if (request.assignedVolunteer.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to complete this request.' });
    }

    request.status = 'completed';
    await request.save();

    res.json({ msg: 'Request marked as completed!', request });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/requests/:id/cancel
// @desc    Help Seeker cancels their own request (if pending or accepted)
// @access  Private (Help Seeker only)
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const request = await HelpRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ msg: 'Request not found' });
    }

    // Only help seekers can cancel their own requests
    if (request.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to cancel this request.' });
    }

    // Only allow cancellation if status is pending or accepted
    if (request.status === 'completed' || request.status === 'cancelled') {
      return res.status(400).json({ msg: `Request is already ${request.status} and cannot be cancelled.` });
    }

    request.status = 'cancelled';
    // If it was accepted, unassign the volunteer
    if (request.assignedVolunteer) {
      request.assignedVolunteer = null;
    }
    await request.save();

    res.json({ msg: 'Request cancelled successfully!', request });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/requests/:id/unassign
// @desc    Volunteer unassigns themselves from an accepted request
// @access  Private (Assigned Volunteer only)
router.put('/:id/unassign', auth, async (req, res) => {
  try {
    const request = await HelpRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ msg: 'Request not found' });
    }

    // Must be in 'accepted' status to unassign
    if (request.status !== 'accepted') {
      return res.status(400).json({ msg: 'Cannot unassign from a request that is not accepted.' });
    }

    // Ensure the volunteer unassigning is the assigned volunteer
    if (!request.assignedVolunteer || request.assignedVolunteer.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to unassign from this request.' });
    }

    request.assignedVolunteer = null; // Remove assignment
    request.status = 'pending'; // Revert to pending
    await request.save();

    res.json({ msg: 'Successfully unassigned from request. It is now pending again.', request });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/requests/:id
// @desc    Delete a request (Help Seeker for their own, or Admin)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const request = await HelpRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ msg: 'Request not found' });
    }

    const user = await User.findById(req.user.id);

    // Check if user is the request owner or an admin
    if (request.user.toString() !== req.user.id && user.role !== 'admin') {
      return res.status(401).json({ msg: 'User not authorized to delete this request.' });
    }

    await request.deleteOne(); // Use deleteOne() for Mongoose 5.x+

    res.json({ msg: 'Request removed' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;
