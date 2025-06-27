// backend/server.js
// This is the main entry point for our backend application. It sets up the server,
// connects to the database, and defines the API routes.

const express = require('express');     // Import the Express.js framework
const mongoose = require('mongoose');   // Import Mongoose for MongoDB interaction
const dotenv = require('dotenv');       // Import dotenv to load environment variables
const cors = require('cors');           // Import cors for Cross-Origin Resource Sharing

// Load environment variables from .env file
dotenv.config();

// Create an Express application instance
const app = express();

// --- Middleware Setup ---
// Enable CORS for all routes
app.use(cors());
// Parse incoming JSON request bodies
app.use(express.json());

// --- Database Connection ---
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB Connected Successfully! Our memory book is open!'))
  .catch(err => console.error('MongoDB Connection Error: Uh oh, cannot connect to memory book!', err));

// --- Routes Setup ---
app.get('/', (req, res) => {
  res.send('API is running... Our brain is saying hello!');
});

// Import and use authentication routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Import and use the helpseeker-specific routes (if any remain separate from general requests)
const helpSeekerRoutes = require('./routes/helpseeker'); // Assuming this exists for specific helpseeker logic
app.use('/api/helpseeker', helpSeekerRoutes);

// Import and use the volunteer-specific routes (if any remain separate from general requests)
const volunteerRoutes = require('./routes/volunteer'); // Assuming this exists for specific volunteer logic
app.use('/api/volunteer', volunteerRoutes);

// CRITICAL: Import and use the general requests routes
// This path is relative to server.js's location.
// server.js is in 'backend/', and requests.js is in 'backend/routes/'
// So, the path should be './routes/requests'
const requestRoutes = require('./routes/requests'); 
app.use('/api/requests', requestRoutes); // All routes in requests.js will be under '/api/requests'

// Import and use the admin routes
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

// Import and use general user-related routes (e.g., profiles)
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);


// --- Start the Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}. Our brain is awake and listening!`));
