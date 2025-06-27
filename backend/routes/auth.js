// backend/routes/auth.js
// This file handles user authentication, specifically registration and login.
// UPDATED: Register route now accepts and saves contactNumber.
// UPDATED: Login route now includes user's name in the JWT payload.

const express = require('express'); // Import Express to create router
const router = express.Router(); // Create an Express router to define routes
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for creating JWTs
const User = require('../models/User'); // Import the User model (our user template)

// Load the JWT_SECRET from environment variables (from our .env file)
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public (anyone can access this route to create an account)
 */
router.post('/register', async (req, res) => {
  // Destructure the request body to get name, email, password, role, AND contactNumber
  const { name, email, contactNumber, password, role } = req.body;

  try {
    // 1. Check if a user with the provided email already exists
    let user = await User.findOne({ email });
    if (user) {
      // If user exists, send a 400 (Bad Request) status with an error message
      return res.status(400).json({ msg: 'User already exists' });
    }

    // 2. Create a new User instance using the data from the request
    user = new User({
      name,
      email,
      contactNumber, // Include contactNumber here
      password,
      // Assign role; if no role is provided, default to 'help_seeker'
      role: role || 'help_seeker'
    });

    // 3. Hash the password for security before saving it
    const salt = await bcrypt.genSalt(10); // Generate a salt (random string) for hashing
    user.password = await bcrypt.hash(password, salt); // Hash the password with the generated salt

    // 4. Save the new user document to the MongoDB database
    await user.save();

    // 5. Create a JSON Web Token (JWT) for the newly registered user
    // The payload contains information that will be encoded into the token
    const payload = {
      user: {
        id: user.id, // The unique ID of the user from MongoDB
        role: user.role, // The role of the user (e.g., 'volunteer', 'help_seeker')
        name: user.name // Include user's name in the JWT payload
      }
    };

    // Sign the token using the JWT_SECRET and set an expiration time (1 hour)
    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '1h' }, // Token will be valid for 1 hour
      (err, token) => {
        if (err) throw err; // If there's an error during signing, throw it
        // Send the generated token back to the client along with a success message
        res.json({ token, msg: 'User registered successfully!', user: { name: user.name, role: user.role } }); // Also send name and role directly in response
      }
    );

  } catch (err) {
    // If any error occurs during the process, log it and send a 500 (Server Error) response
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route POST /api/auth/login
 * @description Authenticate user & get token
 * @access Public (anyone can access this route to log in)
 */
router.post('/login', async (req, res) => {
  // Destructure the request body to get email and password for login
  const { email, password } = req.body;

  try {
    // 1. Check if a user with the provided email exists in the database
    let user = await User.findOne({ email });
    if (!user) {
      // If no user found, send a 400 (Bad Request) status with an error message
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // 2. Compare the provided password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // If passwords don't match, send a 400 (Bad Request) status with an error message
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // 3. If credentials are valid, create a JWT for the authenticated user
    const payload = {
      user: {
        id: user.id, // User's ID
        role: user.role, // User's role
        name: user.name // Include user's name in the JWT payload
      }
    };

    // Sign the token, similar to registration
    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '1h' }, // Token valid for 1 hour
      (err, token) => {
        if (err) throw err;
        // Send the token back to the client along with user name and role for convenience
        res.json({ token, msg: 'Logged in successfully!', user: { name: user.name, role: user.role } });
      }
    );

  } catch (err) {
    // Log any errors and send a 500 (Server Error) response
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Export the router so it can be used in the main server.js file
module.exports = router;
