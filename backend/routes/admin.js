// backend/routes/admin.js
// This file defines API routes specifically for Admin users.
// It includes functionalities for admins to manage users, help requests, and complaints.
// This version adds search and filter capabilities for users, a detailed user profile endpoint,
// AND new endpoints for dashboard statistics (user roles and request statuses).

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Our authentication middleware
const User = require('../models/User'); // Import User model
const HelpRequest = require('../models/HelpRequest'); // Import HelpRequest model
const Complaint = require('../models/Complaint'); // Import Complaint model

/**
 * Middleware to check if the user is an admin.
 */
const isAdmin = (req, res, next) => {
  // Ensure req.user exists and has a role property before accessing it
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied. Not an admin or authentication failed.' });
  }
  next();
};


/**
 * @route GET /api/admin/users
 * @description Get all users with optional search and filters (for admin panel)
 * @access Private (Admin only)
 */
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    console.log('Admin route: Attempting to fetch all users with filters...');

    const { search, role, startDate, endDate } = req.query; // Extract query parameters

    // Build the filter criteria object for Mongoose
    const filterCriteria = {};

    // 1. Search by name or email
    if (search) {
      filterCriteria.$or = [
        { name: { $regex: search, $options: 'i' } }, // Case-insensitive search for name
        { email: { $regex: search, $options: 'i' } }  // Case-insensitive search for email
      ];
    }

    // 2. Filter by role
    if (role && role !== 'all') { // 'all' means no role filter
      filterCriteria.role = role;
    }

    // 3. Filter by registration date
    if (startDate || endDate) {
      filterCriteria.date = {}; // Initialize date criteria object

      if (startDate) {
        // Use $gte (greater than or equal) for start date
        // Convert to Date object to ensure proper comparison
        filterCriteria.date.$gte = new Date(startDate);
      }
      if (endDate) {
        // Use $lte (less than or equal) for end date
        // For end date, often you want to include the whole day, so add one day and use <
        const endOfDay = new Date(endDate);
        endOfDay.setDate(endOfDay.getDate() + 1); // Add a day to include the end date fully
        endOfDay.setHours(0, 0, 0, 0); // Reset time to start of day before adding a day
        filterCriteria.date.$lt = endOfDay;       // Use $lt (less than) for exclusive end
      }
    }

    // Find users based on the constructed filter criteria
    // Exclude the password field for security
    const users = await User.find(filterCriteria).select('-password');
    console.log(`Admin route: Successfully found ${users.length} users based on filters. Criteria:`, filterCriteria);
    res.json(users);
  } catch (err) {
    console.error('Admin Route Error - Fetching Users:', err.message);
    console.error('Full Error Stack:', err.stack);
    res.status(500).send('Server Error fetching users');
  }
});

/**
 * @route GET /api/admin/users/:id/details
 * @description Get comprehensive details for a single user (for admin panel)
 * @access Private (Admin only)
 */
router.get('/users/:id/details', auth, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(`Admin route: Fetching details for user ID: ${userId}`);

    // Fetch the user by ID, excluding password
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Aggregate additional information based on user's role and history

    // 1. Help Requests initiated by this user (if help_seeker)
    const requestsInitiated = user.role === 'help_seeker'
      ? await HelpRequest.countDocuments({ user: userId })
      : 0;

    // 2. Help Requests accepted/completed by this user (if volunteer)
    const requestsAccepted = user.role === 'volunteer'
      ? await HelpRequest.countDocuments({ assignedVolunteer: userId, status: { $in: ['accepted', 'completed'] } })
      : 0;

    const requestsCompleted = user.role === 'volunteer'
      ? await HelpRequest.countDocuments({ assignedVolunteer: userId, status: 'completed' })
      : 0;

    // 3. Complaints filed by this user
    const complaintsFiled = await Complaint.countDocuments({ filedBy: userId });

    // 4. Complaints filed against this user
    const complaintsAgainst = await Complaint.countDocuments({ againstVolunteer: userId });

    // Return the user data along with the aggregated details
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        date: user.date, // Registration date
        lastLogin: user.lastLogin || 'N/A' // Assuming you might add a lastLogin field to User model
      },
      stats: {
        requestsInitiated,
        requestsAccepted,
        requestsCompleted,
        complaintsFiled,
        complaintsAgainst
      }
    });

  } catch (err) {
    console.error('Admin Route Error - Fetching User Details:', err.message);
    console.error('Full Error Stack:', err.stack);
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'User not found (invalid ID format).' });
    }
    res.status(500).send('Server Error fetching user details');
  }
});


/**
 * @route PUT /api/admin/users/:id/role
 * @description Update a user's role
 * @access Private (Admin only)
 */
router.put('/users/:id/role', auth, isAdmin, async (req, res) => {
  const { role } = req.body;

  // Validate the new role
  const validRoles = ['volunteer', 'help_seeker', 'admin'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ msg: 'Invalid role provided.' });
  }

  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.role = role;
    await user.save();
    res.json({ msg: `User role updated to ${role}.`, user });

  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'User not found (invalid ID format).' });
    }
    res.status(500).send('Server Error updating user role');
  }
});

/**
 * @route DELETE /api/admin/users/:id
 * @description Delete a user
 * @access Private (Admin only)
 */
router.delete('/users/:id', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Prevent admin from deleting themselves (optional but recommended)
    if (user._id.toString() === req.user.id) {
        return res.status(400).json({ msg: 'Admins cannot delete their own account via this panel.' });
    }

    await User.deleteOne({ _id: req.params.id }); // Using deleteOne for Mongoose 5+
    res.json({ msg: 'User removed successfully!' });

  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'User not found (invalid ID format).' });
    }
    res.status(500).send('Server Error deleting user');
  }
});

/**
 * @route GET /api/admin/requests
 * @description Get all help requests (for admin panel)
 * @access Private (Admin only)
 */
router.get('/requests', auth, isAdmin, async (req, res) => {
    try {
        console.log('Admin route: Fetching all help requests...');
        const requests = await HelpRequest.find()
                                        .populate('user', ['name', 'email', 'role'])
                                        .populate('assignedVolunteer', ['name', 'email', 'role'])
                                        .sort({ createdAt: -1 });
        console.log(`Admin route: Found ${requests.length} help requests.`);
        res.json(requests);
    } catch (err) {
        console.error('Admin Route Error - Fetching Requests:', err.message);
        console.error('Full Error Stack:', err.stack);
        res.status(500).send('Server Error fetching help requests for admin');
    }
});

/**
 * @route PUT /api/admin/requests/:id/status
 * @description Update the status of any help request (e.g., pending, accepted, completed, cancelled)
 * @access Private (Admin only)
 */
router.put('/requests/:id/status', auth, isAdmin, async (req, res) => {
    const { status } = req.body;

    const validStatuses = ['pending', 'accepted', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ msg: 'Invalid status provided.' });
    }

    try {
        let request = await HelpRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ msg: 'Help request not found' });
        }

        if (status === 'accepted' && !request.assignedVolunteer) {
            // Logic for assigning volunteer upon acceptance if not already assigned
        } else if (status === 'pending' && request.assignedVolunteer) {
            request.assignedVolunteer = undefined;
        }

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
 * @route DELETE /api/admin/requests/:id
 * @description Delete a help request
 * @access Private (Admin only)
 */
router.delete('/requests/:id', auth, isAdmin, async (req, res) => {
  try {
    const request = await HelpRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ msg: 'Help request not found' });
    }

    await HelpRequest.deleteOne({ _id: req.params.id });
    res.json({ msg: 'Help request removed successfully!' });

  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Request not found (invalid ID format).' });
    }
    res.status(500).send('Server Error deleting help request');
  }
});


/**
 * @route GET /api/admin/complaints
 * @description Get all complaints (for admin panel)
 * @access Private (Admin only)
 */
router.get('/complaints', auth, isAdmin, async (req, res) => {
    try {
        console.log('Admin route: Fetching all complaints...');
        const complaints = await Complaint.find()
                                        .populate('filedBy', ['name', 'email'])
                                        .populate('againstVolunteer', ['name', 'email'])
                                        .sort({ filedAt: -1 });
        console.log(`Admin route: Found ${complaints.length} complaints.`);
        res.json(complaints);
    } catch (err) {
        console.error('Admin Route Error - Fetching Complaints:', err.message);
        console.error('Full Error Stack:', err.stack);
        res.status(500).send('Server Error fetching complaints for admin');
    }
});


/**
 * @route PUT /api/admin/complaints/:id/status
 * @description Update the status of a complaint (e.g., reviewed, resolved, dismissed)
 * @access Private (Admin only)
 */
router.put('/complaints/:id/status', auth, isAdmin, async (req, res) => {
    const { status } = req.body;

    const validStatuses = ['pending', 'reviewed', 'resolved', 'dismissed'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ msg: 'Invalid status provided.' });
    }

    try {
        let complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ msg: 'Complaint not found' });
        }

        complaint.status = status;
        if (status === 'resolved' || status === 'dismissed') {
            complaint.resolvedAt = Date.now();
        } else {
            complaint.resolvedAt = undefined;
        }
        await complaint.save();
        res.json({ msg: `Complaint status updated to ${status}.`, complaint });

    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Complaint not found (invalid ID format).' });
        }
        res.status(500).send('Server Error updating complaint status');
    }
});

/**
 * @route GET /api/admin/stats/user-roles
 * @description Get user distribution by roles for admin dashboard
 * @access Private (Admin only)
 */
router.get('/stats/user-roles', auth, isAdmin, async (req, res) => {
  try {
    console.log('Admin route: Fetching user role statistics...');
    const userRoleStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          role: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);
    console.log('User role stats:', userRoleStats);
    res.json(userRoleStats);
  } catch (err) {
    console.error('Admin Route Error - Fetching User Role Stats:', err.message);
    console.error('Full Error Stack:', err.stack);
    res.status(500).send('Server Error fetching user role statistics');
  }
});

/**
 * @route GET /api/admin/stats/request-statuses
 * @description Get help request distribution by status for admin dashboard
 * @access Private (Admin only)
 */
router.get('/stats/request-statuses', auth, isAdmin, async (req, res) => {
  try {
    console.log('Admin route: Fetching request status statistics...');
    const requestStatusStats = await HelpRequest.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          status: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);
    console.log('Request status stats:', requestStatusStats);
    res.json(requestStatusStats);
  } catch (err) {
    console.error('Admin Route Error - Fetching Request Status Stats:', err.message);
    console.error('Full Error Stack:', err.stack);
    res.status(500).send('Server Error fetching request status statistics');
  }
});

module.exports = router;
