import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import "./index.css";

// Suppress non-critical console warnings
if (process.env.NODE_ENV === 'development') {
  const originalWarn = console.warn;
  const originalError = console.error;
  
  console.warn = function(...args) {
    // Suppress tailwind CDN warning in development
    if (args[0]?.includes?.('cdn.tailwindcss.com')) return;
    // Suppress Three.js deprecation warnings
    if (args[0]?.includes?.('This module has been deprecated')) return;
    if (args[0]?.includes?.('has been deprecated')) return;
    originalWarn.apply(console, args);
  };
  
  console.error = function(...args) {
    // Suppress placeholder.com errors as they're not critical
    if (args[0]?.includes?.('placeholder.com')) return;
    originalError.apply(console, args);
  };
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
