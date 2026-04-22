// Safeguard for global fetch issues in some environments
if (typeof window !== 'undefined') {
  // Define global and process for libraries that expect them
  (window as any).global = window;
  (window as any).process = (window as any).process || { env: {}, browser: true };
  
  // Prevent libraries from overwriting the native fetch getter
  const originalFetch = window.fetch;
  try {
    Object.defineProperty(window, 'fetch', {
      value: originalFetch,
      configurable: false,
      writable: false
    });
  } catch (e) {
    // If it's already read-only, that's fine
  }
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);