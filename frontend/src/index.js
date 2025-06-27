// frontend/src/index.js
// This is the entry point of our React application. It renders the main App component
// into the DOM. No global CSS import needed anymore as we are using inline styles.

import React from 'react';
import ReactDOM from 'react-dom/client'; // Import ReactDOM client for React 18+
// Removed: import './index.css'; // No longer needed with inline CSS
import App from './App'; // Import our main App component

// Get the root DOM element where our React app will be mounted
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component into the root element
root.render(
  <React.StrictMode>
    {/* React.StrictMode helps in highlighting potential problems in an application.
        It does not render any visible UI. It activates additional checks and warnings for its descendants. */}
    <App />
  </React.StrictMode>
);

