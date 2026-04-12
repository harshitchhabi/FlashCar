/**
 * main.jsx — React Application Entry Point
 * ============================================
 * GreenRoute v2.0.0
 * Developed by Harshit Chhabi
 * Registration Number: 24BCI0098
 * ============================================
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import HarshitChhabiApp from './App';
import './styles/index.css';
import 'leaflet/dist/leaflet.css';
import { harshitChhabiConsoleBranding } from './utils/constants_24BCI0098';

// Display console branding — Harshit Chhabi (24BCI0098)
harshitChhabiConsoleBranding();
console.log('Developed by Harshit Chhabi - 24BCI0098');
console.log('🚀 GreenRoute React App initialized');

// Render the application
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HarshitChhabiApp />
  </React.StrictMode>
);
