# 🌿 GreenRoute — Sustainable Transportation Platform

**Project:** 24BCI0098_L1+L2+L29+L30_MP_Harshit_Chhabi  
**Developer:** Harshit Chhabi  
**Registration Number:** 24BCI0098  
**Version:** 2.0.0

---

## 📋 About

GreenRoute is a sustainable transportation platform built for Indian cities. It provides smart carpooling, parking finder, and environmental impact tracking to help commuters share rides, reduce emissions, and save money.

## 🚀 Tech Stack

| Technology | Purpose |
|---|---|
| **React.js 18** | Frontend framework (functional components + hooks) |
| **Vite** | Build tool & dev server |
| **React Router DOM** | Client-side routing |
| **Firebase** | Authentication (Google + Email/Password) |
| **Google Maps API** | Interactive maps, directions, Indian city search |
| **Framer Motion** | Scroll animations & transitions |
| **Vanilla CSS** | Design system with custom properties, dark/light themes |

## 🏗️ Project Structure

```
src/
├── main.jsx                    # Entry point
├── App.jsx                     # Router + providers
├── components/
│   ├── common/                 # Navbar, Footer, AnimatedSection, LoadingSkeleton, etc.
│   ├── auth/                   # GoogleSignInButton, ProtectedRoute
│   ├── maps/                   # IndiaMapView (Google Maps)
│   └── notifications/          # NotificationCenter (Toast system)
├── contexts/
│   ├── AuthContext.jsx          # Firebase auth state
│   ├── ThemeContext.jsx         # Dark/Light mode
│   ├── NotificationContext.jsx  # Toast notifications
│   └── FavoritesContext.jsx     # Saved routes
├── pages/
│   ├── HomePage.jsx             # Landing page
│   ├── CarpoolPage.jsx          # Ride sharing with map
│   ├── ParkingPage.jsx          # Smart parking finder
│   ├── DashboardPage.jsx        # User dashboard
│   ├── LoginPage.jsx            # Sign in
│   ├── RegisterPage.jsx         # Sign up
│   └── AboutPage.jsx            # About & credits
├── hooks/                       # useScrollAnimation, useLocalStorage
├── utils/
│   ├── firebase.js              # Firebase config & auth helpers
│   ├── constants_24BCI0098.js   # Identity & app constants
│   ├── indianCities.js          # Indian city data & mock rides
│   └── dateFormatter.js         # Date utilities
└── styles/
    ├── index.css                # Master stylesheet & design system
    ├── themes.css               # Light/dark CSS variables
    └── animations.css           # Keyframe animations
```

## ⚡ Key Features

- **🗺️ Google Maps Integration** — India-focused with city autocomplete & route visualization
- **🔐 Firebase Authentication** — Google Sign-In + Email/Password
- **🌙 Dark Mode** — Toggle with localStorage persistence
- **📱 Fully Responsive** — Mobile-first design
- **✨ Smooth Animations** — Framer Motion scroll animations
- **⭐ Favorites System** — Save routes with localStorage
- **🔔 Toast Notifications** — Animated notification system
- **⚡ Lazy Loading** — Code-split pages for performance
- **💎 Glassmorphism UI** — Premium modern design
- **🇮🇳 India-Focused** — 25+ Indian cities with mock data

## 🛠️ Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app runs at **http://localhost:3000**

## 🔑 API Keys

- **Google Maps:** Pre-configured (free limited access)
- **Firebase:** Pre-configured for GreenRoute project

## 📄 Identity Requirement

This project creatively incorporates the following identity throughout the codebase:

- **Registration Number:** `24BCI0098`
- **Developer Name:** `Harshit Chhabi`

Used in: variable names, function names, component names, console outputs, UI display text, and documentation. Examples:
- `harshitChhabiGoogleSignIn()` — auth handler
- `constants_24BCI0098.js` — identity constants file
- `HarshitChhabiFooterBadge` — footer credit component
- `console.log("Developed by Harshit Chhabi - 24BCI0098")`

---

> Developed with 💚 by **Harshit Chhabi** (24BCI0098)
