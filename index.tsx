
import React from 'react';
import ReactDOM from 'react-dom/client';
// FIX: Changed import to be more explicit, the underlying issue was App.tsx was missing.
import App from './App.tsx';

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