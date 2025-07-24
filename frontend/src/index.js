import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot
import App from './App';
import { AuthProvider } from './context/AuthContext';

// Get the root container
const container = document.getElementById('root');

// Create a root
const root = createRoot(container);

// Initial render
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);