import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <h1 className="heading"> QUOTE OF THE DAY </h1>  {/* Heading before App */}
    <App />
  </React.StrictMode>
);
