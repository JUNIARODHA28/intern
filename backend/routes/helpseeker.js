// backend/routes/helpseeker.js
// This file defines API routes specifically for Help Seeker users.
// It includes functionalities for help seekers to create, view, and delete their
// help requests, as well as submitting reviews for completed requests.

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Our authentication middleware
const HelpRequest = require('../models/HelpRequest'); // Import HelpRequest model
const Review = require('../models/Review'); // Import Review model (will create this next)
const User = require('../models/User'); // Import User model (to populate volunteer details)


/**
 * @route POST /api/helpseeker/requests
 * @description Create a new help request
 * @access Private (Help Seeker only)
 */
router.post('/requests', auth, async (req, res) => {
  // Check if the authenticated user is a help_seeker
  if (req.user.role !== 'help_seeker') {
    return res.status(403).json({ msg: 'Access denied. Not a help seeker.' });
  }

  const { title, description, category } = req.body;

  try {
    // Create a new HelpRequest instance
    const newRequest = new HelpRequest({
      user: req.user.id, // The ID of the authenticated help seeker
      title,
      description,
      category
    });

    // Save the request to the database
    const request = await newRequest.save();
    res.json({ msg: 'Help request created successfully!', request });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error creating help request');
  }
});


/**
 * @route GET /api/helpseeker/requests/me
 * @description Get all help requests created by the authenticated help seeker
 * @access Private (Help Seeker only)
 */
router.get('/requests/me', auth, async (req, res) => {
  // Check if the authenticated user is a help_seeker
  if (req.user.role !== 'help_seeker') {
    return res.status(403).json({ msg: 'Access denied. Not a help seeker.' });
  }

  try {
    // Find all requests where the 'user' field matches the authenticated user's ID
    // Populate the assignedVolunteer field to get volunteer's name and email
    const requests = await HelpRequest.find({ user: req.user.id })
                                    .populate('assignedVolunteer', ['name', 'email'])
                                    .sort({ createdAt: -1 }); // Sort by most recent first

    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error fetching help seeker requests');
  }
});


/**
 * @route DELETE /api/helpseeker/requests/:id
 * @description Delete a help request by ID
 * @access Private (Help Seeker only - can only delete their own requests)
 */
router.delete('/requests/:id', auth, async (req, res) => {
  // Check if the authenticated user is a help_seeker
  if (req.user.role !== 'help_seeker') {
    return res.status(403).json({ msg: 'Access denied. Not a help seeker.' });
  }

  try {
    let request = await HelpRequest.findById(req.params.id);

    // Check if request exists
    if (!request) {
      return res.status(404).json({ msg: 'Help request not found' });
    }

    // Ensure the request belongs to the authenticated help seeker
    // Use .toString() because request.user is an ObjectId object
    if (request.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized to delete this request' });
    }

    // Delete the request
    await HelpRequest.deleteOne({ _id: req.params.id }); // Using deleteOne with query to match by ID

    res.json({ msg: 'Help request removed successfully!' });

  } catch (err) {
    console.error(err.message);
    // If id is not a valid ObjectId, Mongoose will throw a CastError
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Request not found (invalid ID format).' });
    }
    res.status(500).send('Server Error deleting help request');
  }
});

/**
 * @route POST /api/helpseeker/reviews
 * @description Submit a review for a completed help request
 * @access Private (Help Seeker only)
 */
router.post('/reviews', auth, async (req, res) => {
  if (req.user.role !== 'help_seeker') {
    return res.status(403).json({ msg: 'Access denied. Not a help seeker.' });
  }

  const { helpRequestId, rating, comment } = req.body;

  try {
    // 1. Find the help request to ensure it exists and is completed
    let helpRequest = await HelpRequest.findById(helpRequestId);

    if (!helpRequest) {
      return res.status(404).json({ msg: 'Help request not found.' });
    }
    if (helpRequest.status !== 'completed') {
      return res.status(400).json({ msg: 'Only completed requests can be reviewed.' });
    }
    // Ensure the help seeker is the one who created the request
    if (helpRequest.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to review this request.' });
    }
    // Ensure the request has an assigned volunteer
    if (!helpRequest.assignedVolunteer) {
        return res.status(400).json({ msg: 'Cannot review a request without an assigned volunteer.' });
    }
    // Check if a review already exists for this request
    if (helpRequest.hasReview) {
      return res.status(400).json({ msg: 'This request has already been reviewed.' });
    }


    // 2. Create a new review
    const newReview = new Review({
      helpRequest: helpRequestId,
      reviewer: req.user.id, // The help seeker
      reviewedVolunteer: helpRequest.assignedVolunteer, // The volunteer from the request
      rating,
      comment
    });

    await newReview.save();

    // 3. Update the help request to mark it as reviewed
    helpRequest.hasReview = true;
    await helpRequest.save();

    res.json({ msg: 'Review submitted successfully!', review: newReview });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error submitting review');
  }
});

module.exports = router;
