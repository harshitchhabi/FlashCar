/**
 * constants_24BCI0098.js — Identity & App Constants
 * Project: GreenRoute
 * Developer: Harshit Chhabi
 * Registration: 24BCI0098
 */

// ── Developer Identity (Mandatory Requirement) ──────────────
export const DEVELOPER_24BCI0098 = {
  name: 'Harshit Chhabi',
  registrationNumber: '24BCI0098',
  fullIdentity: 'Harshit Chhabi — 24BCI0098',
  projectName: 'GreenRoute',
  version: '2.0.0',
};

// ── Default User Profile Template ───────────────────────────
export const user_24BCI0098 = {
  displayName: 'GreenRoute User',
  photoURL: null,
  role: 'commuter',
  ecoPoints: 0,
  ridesShared: 0,
  co2Saved: 0, // in kg
};

// ── App Configuration ───────────────────────────────────────
export const APP_CONFIG_24BCI0098 = {
  appName: 'GreenRoute',
  tagline: 'Sustainable Transportation for India',
  description: 'Reduce your carbon footprint through optimized carpooling and smart parking solutions across Indian cities.',
  defaultMapCenter: { lat: 20.5937, lng: 78.9629 }, // India center
  defaultMapZoom: 5,
  googleMapsApiKey: 'AIzaSyCbgChQdduzY0jLWL2wt5GSv_V8NcHk8s8',
  maxSeatsPerRide: 7,
  co2PerKmSaved: 0.12, // kg CO2 saved per km carpooled
};

// ── Navigation Links ────────────────────────────────────────
export const NAV_LINKS_24BCI0098 = [
  { path: '/', label: 'Home', id: 'nav-home' },
  { path: '/carpool', label: 'Carpooling', id: 'nav-carpool' },
  { path: '/parking', label: 'Parking', id: 'nav-parking' },
  { path: '/about', label: 'About', id: 'nav-about' },
];

// ── Footer Links ────────────────────────────────────────────
export const FOOTER_LINKS_24BCI0098 = {
  product: [
    { path: '/carpool', label: 'Carpooling' },
    { path: '/parking', label: 'Smart Parking' },
    { path: '/dashboard', label: 'Dashboard' },
  ],
  company: [
    { path: '/about', label: 'About Us' },
    { path: '/about', label: 'Our Mission' },
    { path: '/about', label: 'Contact' },
  ],
};

// ── Console branding ────────────────────────────────────────
export function harshitChhabiConsoleBranding() {
  console.log(
    '%c🌿 GreenRoute v2.0.0 %c Developed by Harshit Chhabi — 24BCI0098 ',
    'background: #059669; color: white; padding: 6px 12px; border-radius: 4px 0 0 4px; font-weight: bold;',
    'background: #0f172a; color: #34d399; padding: 6px 12px; border-radius: 0 4px 4px 0;'
  );
  console.log(
    '%c🎓 Registration Number: 24BCI0098 | Sustainable Transportation Platform',
    'color: #10b981; font-style: italic;'
  );
}
