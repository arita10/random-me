# Random Me - Complete Code Explanation

**Project:** Random Me - Random Selection Tools Web Application
**Technology Stack:** React, Firebase, CSS3
**Author:** Complete Code Documentation
**Date:** December 4, 2025
**Version:** 1.0

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Project Structure](#project-structure)
3. [Core Application (App.js)](#core-application-appjs)
4. [Navigation & Layout](#navigation--layout)
5. [Spinning Wheel Component](#spinning-wheel-component)
6. [Fortune Sticks Component](#fortune-sticks-component)
7. [Card Selector Component](#card-selector-component)
8. [Color Picker Component](#color-picker-component)
9. [Team Assignment Component](#team-assignment-component)
10. [Dice Roller Component](#dice-roller-component)
11. [Utility Functions](#utility-functions)
12. [Firebase Configuration](#firebase-configuration)
13. [CSS Architecture](#css-architecture)
14. [How Everything Works Together](#how-everything-works-together)

---

## 1. Project Overview

### What is Random Me?

Random Me is a comprehensive web application that provides various random selection tools for:
- **Decision Making**: Spinning wheels, fortune sticks, coin flips
- **Game Tools**: Card selectors, dice rollers, matching games
- **Team Management**: Random team assignment with Excel import
- **Creative Tools**: Random color pickers

### Key Features

✅ **9 Interactive Tools**
- Spinning Wheel with color schemes
- Fortune Sticks (shake the bottle)
- Card Selector with flip animations
- Dice Roller
- Color Picker wheel
- Coin Flip
- Rock Paper Scissors
- Matching Game
- Team Assignment

✅ **User Features**
- Google Sign-In authentication
- Save/Load functionality (Firebase)
- Dark/Light theme toggle
- Bulk input (paste lists)
- Excel file import
- Share URLs
- Preset templates
- Mobile responsive

### Technology Stack

```
Frontend:
├── React 18.x (UI Framework)
├── React Router 6.x (Navigation)
├── CSS3 (Styling & Animations)
└── JavaScript ES6+ (Logic)

Backend & Services:
├── Firebase Authentication (Google OAuth)
├── Firebase Firestore (Database)
├── Firebase Hosting (Deployment)
└── Google Analytics (Tracking)

Development Tools:
├── Create React App (Build tool)
├── DOMPurify (XSS Prevention)
├── validator (Input validation)
└── xlsx (Excel file handling)
```

---

## 2. Project Structure

```
render-webapp/
├── public/
│   ├── index.html          # HTML entry point
│   ├── favicon.ico         # Site icon
│   └── manifest.json       # PWA manifest
│
├── src/
│   ├── components/         # React components
│   │   ├── SpinningWheel.js       # Main wheel selector
│   │   ├── SpinningWheel.css
│   │   ├── FortuneSticks.js       # Shake bottle selector
│   │   ├── FortuneSticks.css
│   │   ├── CardSelector.js        # Card deck selector
│   │   ├── CardSelector.css
│   │   ├── ColorPicker.js         # Color wheel
│   │   ├── ColorPicker.css
│   │   ├── TeamAssignment.js      # Team divider
│   │   ├── TeamAssignment.css
│   │   ├── DiceRoller.js          # Dice roller
│   │   ├── DiceRoller.css
│   │   ├── CoinFlip.js            # Coin flip
│   │   ├── RockPaperScissors.js   # RPS game
│   │   ├── MatchingGame.js        # Memory game
│   │   ├── Navigation.js          # Top nav bar
│   │   ├── Navigation.css
│   │   ├── Footer.js              # Bottom footer
│   │   ├── Footer.css
│   │   └── LandingPage.js         # Home page
│   │
│   ├── config/             # Configuration files
│   │   └── firebase.js     # Firebase config
│   │
│   ├── utils/              # Utility functions
│   │   ├── security.js     # Security & validation
│   │   ├── validation.js   # Additional validation
│   │   └── analytics.js    # Google Analytics
│   │
│   ├── firebase.js         # Firebase initialization
│   ├── App.js              # Main app component
│   ├── App.css             # Global styles
│   └── index.js            # React entry point
│
├── package.json            # Dependencies
├── .env                    # Environment variables
└── README.md               # Project documentation
```

---

## 3. Core Application (App.js)

### Complete Code Walkthrough

```javascript
// Line 1-7: Imports
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { initGA, logPageView } from './utils/analytics';
import './App.css';
```

**What's happening:**
- **React & Hooks**: Import React and hooks for state management
- **Router**: Import routing components for navigation
- **Firebase Auth**: Import authentication functions
- **Analytics**: Import Google Analytics functions
- **CSS**: Import global styles

```javascript
// Line 8-22: Component Imports
import SpinningWheel from './components/SpinningWheel';
import DiceRoller from './components/DiceRoller';
import CardSelector from './components/CardSelector';
import TeamAssignment from './components/TeamAssignment';
import ColorPicker from './components/ColorPicker';
import CoinFlip from './components/CoinFlip';
import RockPaperScissors from './components/RockPaperScissors';
import MatchingGame from './components/MatchingGame';
import FortuneSticks from './components/FortuneSticks';

import LandingPage from './components/LandingPage';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
```

**What's happening:**
- Import all tool components (9 tools)
- Import UI components (landing page, nav, footer)

```javascript
// Line 24-33: Analytics Tracker Component
function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    logPageView(location.pathname + location.search);
  }, [location]);

  return null;
}
```

**What's happening:**
- Creates a component that tracks page changes
- `useLocation()`: Gets current URL path
- `useEffect()`: Runs when location changes
- `logPageView()`: Sends page view to Google Analytics
- Returns `null`: This component doesn't render anything

```javascript
// Line 35-43: Main App Component Start
function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);

  // Initialize Google Analytics
  useEffect(() => {
    initGA();
  }, []);
```

**What's happening:**
- **darkMode state**: Track if dark mode is on/off (default: false)
- **user state**: Store logged-in user info (default: null = not logged in)
- **initGA()**: Initialize Google Analytics when app loads
- **Empty dependency []**: Run only once on mount

```javascript
// Line 44-50: Authentication Listener
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });
  return () => unsubscribe();
}, []);
```

**What's happening:**
1. **onAuthStateChanged**: Firebase listener for auth changes
2. When user signs in/out → calls callback function
3. **setUser(currentUser)**: Update user state
4. **return unsubscribe**: Cleanup function (stop listening when component unmounts)
5. **Empty []**: Set up listener only once

```javascript
// Line 52-68: Dark Mode Management
useEffect(() => {
  const savedMode = localStorage.getItem('darkMode');
  if (savedMode) {
    setDarkMode(JSON.parse(savedMode));
  }
}, []);

useEffect(() => {
  if (darkMode) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
  localStorage.setItem('darkMode', JSON.stringify(darkMode));
}, [darkMode]);

const theme = darkMode ? 'dark' : 'light';

const toggleDarkMode = () => {
  setDarkMode(!darkMode);
};
```

**What's happening:**

**First useEffect** (Load saved preference):
1. Get 'darkMode' from localStorage
2. If found, parse JSON and set state
3. Runs once on app load

**Second useEffect** (Apply dark mode):
1. If darkMode is true → add 'dark-mode' class to <body>
2. If false → remove the class
3. Save current state to localStorage
4. Runs every time darkMode changes

**theme variable**: Convert boolean to string ('dark' or 'light')
**toggleDarkMode function**: Flip the boolean (true ↔ false)

```javascript
// Line 76-109: Render JSX
return (
  <Router>
    <AnalyticsTracker />
    <div className={`app-container ${theme === 'light' ? 'light-theme' : 'dark-theme'}`}>
      <Navigation
        darkMode={darkMode}
        user={user}
        toggleDarkMode={toggleDarkMode}
      />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/wheel" element={<SpinningWheel theme={theme} />} />
          <Route path="/cards" element={<CardSelector theme={theme} />} />
          <Route path="/dice" element={<DiceRoller theme={theme} />} />
          <Route path="/color" element={<ColorPicker theme={theme} />} />
          <Route path="/fortune-sticks" element={<FortuneSticks theme={theme} />} />
          <Route path="/coin-flip" element={<CoinFlip theme={theme} />} />
          <Route path="/rps" element={<RockPaperScissors theme={theme} />} />
          <Route path="/matching-game" element={<MatchingGame theme={theme} />} />
          <Route path="/team-assignment" element={<TeamAssignment theme={theme} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <Footer />
    </div>
  </Router>
);
```

**What's happening:**

**<Router>**: Wraps entire app to enable routing
**<AnalyticsTracker />**: Tracks page views
**<div className={...}>**: Main container with dynamic class based on theme
**<Navigation>**: Top nav bar with props:
  - `darkMode`: Current theme state
  - `user`: Logged in user info
  - `toggleDarkMode`: Function to switch theme

**<main>**: Main content area
**<Routes>**: Defines URL paths and components
**<Route>**: Each route maps URL to component
  - `path="/"`: Home page → LandingPage
  - `path="/wheel"`: Spinning wheel → SpinningWheel
  - `path="*"`: Any other URL → Redirect to home

**theme prop**: Passed to each component so they know if dark/light

**<Footer />**: Bottom footer

### App.js Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        APP STARTS                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  INITIALIZATION (useEffect with [])                         │
│  1. Initialize Google Analytics                             │
│  2. Set up Firebase auth listener                           │
│  3. Load dark mode preference from localStorage             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  RENDER MAIN STRUCTURE                                      │
│  ┌──────────────────────────────────────────────┐          │
│  │  <Router>                                    │          │
│  │    ├── AnalyticsTracker (tracks pages)      │          │
│  │    ├── Navigation (top menu)                │          │
│  │    ├── Routes (URL routing)                 │          │
│  │    │   ├── / → LandingPage                  │          │
│  │    │   ├── /wheel → SpinningWheel           │          │
│  │    │   ├── /cards → CardSelector            │          │
│  │    │   └── ... (9 tools total)              │          │
│  │    └── Footer (bottom)                       │          │
│  └──────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  USER INTERACTIONS                                          │
│                                                             │
│  User clicks nav link                                       │
│         ↓                                                   │
│  React Router changes URL                                   │
│         ↓                                                   │
│  AnalyticsTracker detects change                            │
│         ↓                                                   │
│  Routes component renders matching component                │
│         ↓                                                   │
│  Component displays with theme prop                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Navigation & Layout

### Navigation.js - Complete Explanation

```javascript
// Line 1-4: Imports
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { signInWithGoogle, signOutUser } from '../firebase';
import './Navigation.css';
```

**Line 6-9: Component Setup**
```javascript
function Navigation({ darkMode, user, toggleDarkMode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdown, setDropdown] = useState(null);
  const location = useLocation();
```

**What's happening:**
- **Props received**:
  - `darkMode`: boolean (true/false)
  - `user`: object with user info or null
  - `toggleDarkMode`: function to switch theme
- **State**:
  - `mobileMenuOpen`: Is mobile menu open? (false by default)
  - `dropdown`: Which dropdown is currently open? (null = none)
- **location**: Current URL path (e.g., "/wheel")

```javascript
// Line 11: Check if current page is active
const isActive = (path) => location.pathname === path;
```

**Example:**
- If current URL is `/wheel`
- `isActive('/wheel')` returns `true`
- `isActive('/cards')` returns `false`

```javascript
// Line 13-27: Sign In/Out Handlers
const handleSignIn = async () => {
  try {
    await signInWithGoogle();
  } catch (error) {
    alert("Error signing in: " + error.message);
  }
};

const handleSignOut = async () => {
  try {
    await signOutUser();
  } catch (error) {
    alert("Error signing out: " + error.message);
  }
};
```

**What's happening:**
- **async/await**: Handle Firebase promises
- **try/catch**: Handle errors gracefully
- If error occurs → show alert to user

```javascript
// Line 29-57: Menu Structure
const menuItems = [
  {
    title: 'Selection Tools',
    icon: '🎯',
    items: [
      { path: '/wheel', icon: '🎲', label: 'Spinning Wheel' },
      { path: '/fortune-sticks', icon: '🥢', label: 'Fortune Sticks' },
      { path: '/cards', icon: '🃏', label: 'Card Selector' },
      { path: '/dice', icon: '🎲', label: 'Dice Roller' },
      { path: '/color', icon: '🎨', label: 'Color Picker' }
    ]
  },
  {
    title: 'Games',
    icon: '🎮',
    items: [
      { path: '/coin-flip', icon: '🪙', label: 'Coin Flip' },
      { path: '/rps', icon: '✊', label: 'Rock Paper Scissors' },
      { path: '/matching-game', icon: '🃏', label: 'Matching Game' }
    ]
  },
  {
    title: 'Team Tools',
    icon: '👥',
    items: [
      { path: '/team-assignment', icon: '📋', label: 'Team Assignment' }
    ]
  }
];
```

**Structure:**
```
menuItems = [
  {
    title: "Category Name",
    icon: "Emoji",
    items: [
      { path: "/url", icon: "🎲", label: "Display Name" }
    ]
  }
]
```

```javascript
// Line 59-96: Desktop Menu Rendering
return (
  <nav className="navigation">
    <div className="nav-container">
      <Link to="/" className="logo">
        <span className="logo-icon">🎡</span>
        <span className="logo-text">Random Me</span>
      </Link>

      {/* Desktop Menu */}
      <div className="nav-links desktop-menu">
        {menuItems.map((menu, menuIndex) => (
          <div
            key={menuIndex}
            className="nav-dropdown"
            onMouseEnter={() => setDropdown(menuIndex)}
            onMouseLeave={() => setDropdown(null)}
          >
            <button className="nav-link dropdown-toggle">
              <span className="nav-icon">{menu.icon}</span>
              {menu.title}
              <span className="dropdown-arrow">▼</span>
            </button>

            <div className={`dropdown-menu ${dropdown === menuIndex ? 'show' : ''}`}>
              {menu.items.map((item, itemIndex) => (
                <Link
                  key={itemIndex}
                  to={item.path}
                  className={`dropdown-item ${isActive(item.path) ? 'active' : ''}`}
                >
                  <span className="item-icon">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
```

**What's happening:**

**Logo Link**:
- Clicking 🎡 Random Me → goes to home page

**Desktop Menu**:
- `.map()` loops through each menu category
- `onMouseEnter`: Mouse over → open dropdown
- `onMouseLeave`: Mouse away → close dropdown
- `dropdown === menuIndex ? 'show' : ''`: Add 'show' class if this menu is open
- Nested `.map()` for menu items
- `isActive()`: Highlight current page

```javascript
// Line 98-138: User Actions Section
<div className="nav-actions">
  <button
    onClick={toggleDarkMode}
    className="theme-toggle-btn"
    aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
  >
    {darkMode ? '☀️' : '🌙'}
  </button>

  {!user ? (
    <button onClick={handleSignIn} className="google-signin-button">
      <svg>...</svg>
      Sign in
    </button>
  ) : (
    <div className="user-info">
      {user.photoURL && <img src={user.photoURL} alt="Profile" className="user-avatar" />}
      <span className="user-name">{user.displayName}</span>
      <button onClick={handleSignOut} className="signout-button">
        <svg>...</svg>
      </button>
    </div>
  )}

  {/* Mobile menu button */}
  <button
    className="mobile-menu-btn"
    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
    aria-label="Toggle menu"
  >
    <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
      <span></span>
      <span></span>
      <span></span>
    </span>
  </button>
</div>
```

**What's happening:**

**Theme Toggle**:
- Shows ☀️ if dark mode (click to go light)
- Shows 🌙 if light mode (click to go dark)

**Sign In/Out**:
- If no user (`!user`) → show "Sign in" button
- If user exists → show:
  - Profile photo (if available)
  - Display name
  - Sign out button

**Mobile Menu Button**:
- Three horizontal lines (hamburger icon)
- Click → toggle mobile menu
- `open` class → animate to X shape

```javascript
// Line 141-180: Mobile Menu
<div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
  {menuItems.map((menu, menuIndex) => (
    <div key={menuIndex} className="mobile-menu-section">
      <div className="mobile-section-title">
        <span className="nav-icon">{menu.icon}</span>
        {menu.title}
      </div>
      {menu.items.map((item, itemIndex) => (
        <Link
          key={itemIndex}
          to={item.path}
          className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(false)}
        >
          <span className="nav-icon">{item.icon}</span>
          {item.label}
        </Link>
      ))}
    </div>
  ))}

  {/* Mobile sign in/out buttons (same as desktop) */}
</div>
```

**What's happening:**
- Hidden by default
- `open` class → slides in from side
- Click link → close mobile menu (`setMobileMenuOpen(false)`)
- Same menu structure as desktop, different layout

### Navigation Flow

```
┌─────────────────────────────────────────────────────────────┐
│  USER HOVERS OVER "SELECTION TOOLS"                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  onMouseEnter fires                                         │
│  setDropdown(0) ← index of "Selection Tools"                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Component re-renders                                       │
│  dropdown === 0 → add 'show' class to dropdown menu         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  CSS animation                                              │
│  Dropdown menu slides down and becomes visible              │
│                                                             │
│  ┌─────────────────────────────┐                           │
│  │ 🎲 Spinning Wheel          │                           │
│  │ 🥢 Fortune Sticks          │                           │
│  │ 🃏 Card Selector           │                           │
│  │ 🎲 Dice Roller             │                           │
│  │ 🎨 Color Picker            │                           │
│  └─────────────────────────────┘                           │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  USER CLICKS "SPINNING WHEEL"                               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  React Router navigates to /wheel                           │
│  SpinningWheel component renders                            │
│  isActive('/wheel') returns true                            │
│  Link gets 'active' class → highlighted                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Spinning Wheel Component

### Complete Code Breakdown

**File:** `src/components/SpinningWheel.js`

### State Management (Lines 21-48)

```javascript
const [options, setOptions] = useState(['Option 1', 'Option 2', 'Option 3', 'Option 4']);
const [newOption, setNewOption] = useState('');
const [isSpinning, setIsSpinning] = useState(false);
const [rotation, setRotation] = useState(0);
const [selectedOption, setSelectedOption] = useState(null);
const [isMuted, setIsMuted] = useState(false);
const [language] = useState('en');
const [showColorPicker, setShowColorPicker] = useState(false);
const [customColors, setCustomColors] = useState(null);
```

**State Variables Explained:**

| Variable | Type | Purpose | Example Value |
|----------|------|---------|---------------|
| `options` | Array | List of wheel choices | `['Pizza', 'Burger', 'Sushi']` |
| `newOption` | String | Input field value | `'Tacos'` |
| `isSpinning` | Boolean | Is wheel currently spinning? | `true` / `false` |
| `rotation` | Number | Current rotation angle | `2780` degrees |
| `selectedOption` | String/null | Last selected option | `'Pizza'` or `null` |
| `isMuted` | Boolean | Is sound muted? | `true` / `false` |
| `language` | String | UI language | `'en'` (English) |
| `showColorPicker` | Boolean | Show color picker panel? | `true` / `false` |
| `customColors` | String/null | Selected color scheme | `'sunset'` or `null` |

### Color Schemes (Lines 551-612)

```javascript
const colorSchemes = {
  rainbow: [
    'linear-gradient(135deg, #FF0080 0%, #FF0000 100%)',
    'linear-gradient(135deg, #FF4500 0%, #FF8C00 100%)',
    'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    'linear-gradient(135deg, #00FF00 0%, #32CD32 100%)',
    'linear-gradient(135deg, #00CED1 0%, #1E90FF 100%)',
    'linear-gradient(135deg, #4169E1 0%, #0000FF 100%)',
    'linear-gradient(135deg, #8A2BE2 0%, #9400D3 100%)',
    'linear-gradient(135deg, #FF1493 0%, #FF69B4 100%)',
  ],
  pastel: [...],
  vibrant: [...],
  ocean: [...],
  sunset: [...],
  forest: [...]
};

const rainbowColors = customColors ? colorSchemes[customColors] : colorSchemes.rainbow;
```

**How Color Schemes Work:**

1. **Default**: `rainbow` colors used
2. **User clicks "🌅 Sunset"**: `setCustomColors('sunset')`
3. **rainbowColors**: Now uses `colorSchemes['sunset']`
4. **Wheel re-renders** with new colors

### Spin Function (Lines 410-475)

```javascript
const spinWheel = () => {
  if (isSpinning || options.length === 0) return;

  setIsSpinning(true);
  setSelectedOption(null);

  // Play sound
  if (!isMuted) {
    playSpinSound();
  }

  // Random rotations: 5-10 full spins + random angle
  const spins = 5 + Math.floor(Math.random() * 5);
  const extraRotation = Math.floor(Math.random() * 360);
  const totalRotation = rotation + (spins * 360) + extraRotation;

  setRotation(totalRotation);

  // After 4 seconds, determine winner
  setTimeout(() => {
    const normalizedRotation = totalRotation % 360;
    const segmentAngle = 360 / options.length;
    const selectedIndex = Math.floor((360 - normalizedRotation) / segmentAngle) % options.length;

    setSelectedOption(options[selectedIndex]);
    setIsSpinning(false);

    if (!isMuted) {
      playResultSound();
    }
  }, 4000);
};
```

**Step-by-Step Explanation:**

**Step 1: Validation**
```javascript
if (isSpinning || options.length === 0) return;
```
- Don't spin if already spinning
- Don't spin if no options

**Step 2: Initialize**
```javascript
setIsSpinning(true);
setSelectedOption(null);
```
- Mark as spinning (disables button)
- Clear previous result

**Step 3: Sound**
```javascript
if (!isMuted) {
  playSpinSound();
}
```
- Play spinning sound if not muted

**Step 4: Calculate Rotation**
```javascript
const spins = 5 + Math.floor(Math.random() * 5);
const extraRotation = Math.floor(Math.random() * 360);
const totalRotation = rotation + (spins * 360) + extraRotation;
```

**Math Breakdown:**
- `spins`: Random number between 5-9 (full rotations)
- `extraRotation`: Random angle 0-359 degrees
- `totalRotation`: Current rotation + new spins

**Example:**
```
Current rotation: 720° (2 full spins from last time)
spins: 7
extraRotation: 234°

totalRotation = 720 + (7 × 360) + 234
              = 720 + 2520 + 234
              = 3474°
```

**Step 5: Apply Rotation**
```javascript
setRotation(totalRotation);
```
- Updates rotation state
- CSS transition animates the wheel

**Step 6: Determine Winner (after 4 seconds)**
```javascript
setTimeout(() => {
  const normalizedRotation = totalRotation % 360;
  const segmentAngle = 360 / options.length;
  const selectedIndex = Math.floor((360 - normalizedRotation) / segmentAngle) % options.length;

  setSelectedOption(options[selectedIndex]);
  setIsSpinning(false);
}, 4000);
```

**Math Explanation:**

**normalizedRotation**: Get final angle (0-359°)
```
3474 % 360 = 234°
```

**segmentAngle**: Degrees per option
```
If 8 options: 360 / 8 = 45° each
```

**selectedIndex**: Which segment landed at top
```
(360 - 234) / 45 = 126 / 45 = 2.8
floor(2.8) = 2
Index 2 % 8 = 2

Winner: options[2]
```

### Wheel Rendering (Lines 634-643)

```javascript
<div className="wheel-container">
  <div className="pointer-container">
    <div className="pointer-arrow">▼</div>
    <div className="pointer-line"></div>
  </div>

  <div
    className="wheel"
    style={{
      transform: `rotate(${rotation}deg)`,
      transition: isSpinning ? 'transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none'
    }}
  >
    {options.map((option, index) => {
      const segmentAngle = 360 / options.length;
      const rotation = segmentAngle * index;
      const color = rainbowColors[index % rainbowColors.length];

      return (
        <div
          key={index}
          className="wheel-segment"
          style={{
            transform: `rotate(${rotation}deg)`,
            clipPath: `polygon(50% 50%, 50% 0%, ${getSegmentPath(segmentAngle)}% ${getSegmentPath2(segmentAngle)}%)`
          }}
        >
          <div
            className="segment-content"
            style={{
              transform: `rotate(${segmentAngle / 2}deg)`,
              background: color
            }}
          >
            <span className="segment-text">{option}</span>
          </div>
        </div>
      );
    })}
  </div>
</div>
```

**Wheel Structure:**

```
┌───────────────────────────────────────┐
│          POINTER (fixed)              │
│               ▼                       │
├───────────────────────────────────────┤
│                                       │
│            WHEEL (rotates)            │
│         ╔═════════════╗               │
│         ║   Segment   ║               │
│         ║      1      ║               │
│    ╔════╩═════════════╩════╗          │
│    ║    Segment 2    Seg 8 ║          │
│    ║                        ║          │
│    ║  Seg 3         Seg 7   ║          │
│    ║                        ║          │
│    ║    Segment 4    Seg 6  ║          │
│    ╚════╦═════════════╦════╝          │
│         ║   Segment   ║               │
│         ║      5      ║               │
│         ╚═════════════╝               │
│                                       │
└───────────────────────────────────────┘
```

**CSS Transform:**
```css
transform: rotate(2340deg);
transition: transform 4s cubic-bezier(0.25, 0.1, 0.25, 1);
```

**What happens:**
1. Wheel rotates from current angle to 2340°
2. Animation takes 4 seconds
3. `cubic-bezier`: Easing function (slow start, fast middle, slow end)

### Bulk Add Feature (Lines 350-378)

```javascript
const handleBulkAdd = () => {
  if (bulkInput.trim() === '') return;

  // Split by newlines, commas, or semicolons
  const items = bulkInput
    .split(/[\n,;]+/)
    .map(item => item.trim())
    .filter(item => item !== '');

  // Validate each item
  const validation = validateNamesList(items, SECURITY_LIMITS.MAX_OPTIONS_COUNT);

  if (!validation.valid) {
    setError(validation.errors.join(', '));
    return;
  }

  // Combine with existing options and remove duplicates
  const combinedOptions = [...options, ...validation.sanitized];
  const uniqueOptions = [...new Set(combinedOptions)];

  if (uniqueOptions.length > SECURITY_LIMITS.MAX_OPTIONS_COUNT) {
    setError(`Maximum ${SECURITY_LIMITS.MAX_OPTIONS_COUNT} options allowed`);
    return;
  }

  setOptions(uniqueOptions);
  setBulkInput('');
  setShowBulkInput(false);
};
```

**Example Input:**
```
Pizza
Burger, Sushi
Tacos;Pasta
Salad
```

**Processing Steps:**

1. **Split by delimiters**:
```javascript
.split(/[\n,;]+/)
// Result: ['Pizza', 'Burger', ' Sushi', 'Tacos', 'Pasta', 'Salad']
```

2. **Trim whitespace**:
```javascript
.map(item => item.trim())
// Result: ['Pizza', 'Burger', 'Sushi', 'Tacos', 'Pasta', 'Salad']
```

3. **Remove empty strings**:
```javascript
.filter(item => item !== '')
// Result: ['Pizza', 'Burger', 'Sushi', 'Tacos', 'Pasta', 'Salad']
```

4. **Validate** (sanitize HTML, check length, etc.)

5. **Combine and deduplicate**:
```javascript
const combinedOptions = [...options, ...validation.sanitized];
// If options = ['Pizza', 'Burger']
// Result: ['Pizza', 'Burger', 'Pizza', 'Burger', 'Sushi', 'Tacos', 'Pasta', 'Salad']

const uniqueOptions = [...new Set(combinedOptions)];
// Result: ['Pizza', 'Burger', 'Sushi', 'Tacos', 'Pasta', 'Salad']
```

### Firebase Save/Load (Lines 238-293)

```javascript
const handleSaveWheel = async () => {
  if (!user) {
    setError('Please sign in to save wheels');
    return;
  }

  if (!wheelName.trim()) {
    setError('Please enter a wheel name');
    return;
  }

  try {
    await addDoc(collection(db, 'wheels'), {
      userId: user.uid,
      name: wheelName,
      options: options,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    setError('');
    alert('Wheel saved successfully! ✅');
    loadUserWheels(user.uid);
  } catch (error) {
    console.error('Error saving wheel:', error);
    setError('Failed to save wheel');
  }
};
```

**Firestore Document Structure:**
```json
{
  "userId": "abc123xyz789",
  "name": "Lunch Choices",
  "options": ["Pizza", "Burger", "Sushi", "Tacos"],
  "createdAt": Timestamp(2025-12-04 10:30:00),
  "updatedAt": Timestamp(2025-12-04 10:30:00)
}
```

**Security:**
- Each document has `userId` field
- Firestore rules ensure users can only access their own data

---

## 6. Fortune Sticks Component

### Concept Overview

Fortune Sticks simulates the traditional Asian fortune-telling method:
1. User adds choices as "sticks" in a bottle
2. Shake the bottle
3. One stick randomly falls out
4. See the result

### State Management (Lines 10-23)

```javascript
const [sticks, setSticks] = useState([]);
const [newStick, setNewStick] = useState('');
const [isShaking, setIsShaking] = useState(false);
const [selectedStick, setSelectedStick] = useState(null);
const [fallingStick, setFallingStick] = useState(null);
const [isMuted, setIsMuted] = useState(false);
const [bottleName, setBottleName] = useState('Fortune Sticks');
const [savedBottles, setSavedBottles] = useState([]);
const [showSaved, setShowSaved] = useState(false);
const [error, setError] = useState('');
const [bulkInput, setBulkInput] = useState('');
const [showBulkInput, setShowBulkInput] = useState(false);
const [shareUrl, setShareUrl] = useState('');
const [showShareUrl, setShowShareUrl] = useState(false);
```

**Stick Data Structure:**
```javascript
[
  { id: 1670000000001, text: 'Yes' },
  { id: 1670000000002, text: 'No' },
  { id: 1670000000003, text: 'Maybe' }
]
```

### Shake Animation (Lines 136-170)

```javascript
const shakeBottle = () => {
  if (sticks.length === 0) {
    alert('Please add choices first');
    return;
  }

  if (isShaking) return;

  setIsShaking(true);
  setSelectedStick(null);
  setFallingStick(null);

  // Play shake sound multiple times
  const shakeInterval = setInterval(() => {
    playShakeSound();
  }, 200);

  // After 2 seconds, select a random stick
  setTimeout(() => {
    clearInterval(shakeInterval);
    setIsShaking(false);

    const randomIndex = Math.floor(Math.random() * sticks.length);
    const selected = sticks[randomIndex];

    setFallingStick(selected);

    // After falling animation (1 second), show result
    setTimeout(() => {
      setFallingStick(null);
      setSelectedStick(selected);
      playSelectSound();
    }, 1000);
  }, 2000);
};
```

**Timeline:**

```
Time 0s:
├── User clicks "Shake" button
├── setIsShaking(true) ← Bottle starts shaking
├── Play sound every 0.2 seconds
│
Time 0.2s: 🔊 Shake sound
Time 0.4s: 🔊 Shake sound
Time 0.6s: 🔊 Shake sound
...
│
Time 2s:
├── Stop shake sounds
├── setIsShaking(false) ← Bottle stops shaking
├── Select random stick
├── setFallingStick(selected) ← Stick starts falling
│
Time 3s:
├── setFallingStick(null) ← Stop falling animation
├── setSelectedStick(selected) ← Show result
└── 🔊 Play result sound
```

### Bottle Rendering (Lines 332-360)

```javascript
<div className={`bottle ${isShaking ? 'shaking' : ''}`}>
  <div className="bottle-top"></div>
  <div className="bottle-body">
    {sticks.map((stick, index) => (
      <div
        key={stick.id}
        className={`stick ${fallingStick?.id === stick.id ? 'falling' : ''}`}
        style={{
          left: `${20 + (index % 3) * 25}%`,
          animationDelay: `${index * 0.1}s`
        }}
      >
        {stick.text.substring(0, 1)}
      </div>
    ))}
  </div>
  {sticks.length === 0 && (
    <div className="bottle-empty">Empty</div>
  )}
</div>

{fallingStick && (
  <div className="falling-stick-display">
    <div className="falling-stick-animation">
      {fallingStick.text}
    </div>
  </div>
)}
```

**Visual Representation:**

```
┌────────────────┐
│  BOTTLE TOP    │ ← bottle-top
├────────────────┤
│                │
│   │ │ │ │ │    │ ← Sticks (first character only)
│   Y N M P L    │    "Yes" → "Y", "No" → "N"
│   │ │ │ │ │    │
│   │ │ │ │ │    │
│                │
└────────────────┘

When shaking:
.shaking class → CSS animation

When falling:
┌────────────────┐
│  BOTTLE TOP    │
├────────────────┤
│                │
│   │ │   │ │    │ ← One stick missing
│   Y N   P L    │
│   │ │   │ │    │
│                │
└────────────────┘
        ↓
      "Maybe"  ← Falling stick (full text)
        ↓
```

**CSS Classes:**
- `.shaking`: Rapid side-to-side animation
- `.falling`: Stick moves down and fades
- `.stick`: Individual stick inside bottle

### Preset Loading (Lines 271-304)

```javascript
const loadPreset = (presetName) => {
  const presets = {
    zodiac: [
      'Aries ♈', 'Taurus ♉', 'Gemini ♊', 'Cancer ♋',
      'Leo ♌', 'Virgo ♍', 'Libra ♎', 'Scorpio ♏',
      'Sagittarius ♐', 'Capricorn ♑', 'Aquarius ♒', 'Pisces ♓'
    ],
    yesNo: [
      'Yes ✅', 'No ❌', 'Maybe 🤔', 'Definitely 💯',
      'Probably 👍', 'Unlikely 👎', 'Ask Again 🔄', 'Not Sure 🤷'
    ],
    lucky: [
      'Very Lucky 🍀', 'Lucky ✨', 'Neutral ⭐',
      'Unlucky 🌧️', 'Very Unlucky ⚠️', 'Super Lucky 🎉',
      'Good Fortune 🎊', 'Bad Fortune 💔'
    ],
    numbers: Array.from({ length: 20 }, (_, i) => `Number ${i + 1}`)
  };

  const preset = presets[presetName];
  if (preset) {
    const newSticks = preset.map(item => ({
      id: Date.now() + Math.random(),
      text: item
    }));
    setSticks(newSticks);
    setBottleName(
      presetName === 'zodiac' ? 'Zodiac Signs ♈' :
      presetName === 'yesNo' ? 'Yes or No ❓' :
      presetName === 'lucky' ? 'Fortune Telling 🔮' :
      'Number Sticks 🔢'
    );
  }
};
```

**Usage:**
```javascript
<button onClick={() => loadPreset('zodiac')}>
  ♈ Zodiac Signs
</button>
```

**What happens:**
1. Gets preset array from `presets` object
2. Converts each text to stick object with unique ID
3. Updates sticks state
4. Changes bottle name to match preset

---

## 7. Card Selector Component

### Card Flip Mechanism

**Concept:** Cards start face-down. Click to flip and reveal.

### Card State (Lines 20-50)

```javascript
const [cardOptions, setCardOptions] = useState([
  { name: 'Ace ♠', maxSelections: 3, timesSelected: 0 },
  { name: 'King ♥', maxSelections: 3, timesSelected: 0 },
  { name: 'Queen ♦', maxSelections: 3, timesSelected: 0 },
  { name: 'Jack ♣', maxSelections: 3, timesSelected: 0 },
  // ...
]);

const [flippedCards, setFlippedCards] = useState([]);
const [selectedCardIndex, setSelectedCardIndex] = useState(null);
```

**Card Object Structure:**
```javascript
{
  name: 'Ace ♠',           // Display text
  maxSelections: 3,        // How many times can be selected
  timesSelected: 0         // Counter: how many times selected so far
}
```

**flippedCards Array:**
```javascript
[0, 2, 5]  // Indices of cards that have been flipped
```

### Card Click Handler (Lines 260-286)

```javascript
const handleCardClick = (index) => {
  const card = cardOptions[index];

  // Check if maxed out
  if (card.timesSelected >= card.maxSelections) {
    alert('This card has been selected the maximum number of times!');
    return;
  }

  // Check if already flipped
  if (flippedCards.includes(index)) {
    return;
  }

  // Add to flipped cards
  setFlippedCards([...flippedCards, index]);
  setSelectedCardIndex(index);

  // Increment counter
  const updatedOptions = cardOptions.map((opt, idx) => {
    if (idx === index && opt.timesSelected < opt.maxSelections) {
      return {
        ...opt,
        timesSelected: opt.timesSelected + 1
      };
    }
    return opt;
  });

  setCardOptions(updatedOptions);
};
```

**Step-by-Step:**

**Before Click:**
```javascript
cardOptions[0] = { name: 'Ace ♠', maxSelections: 3, timesSelected: 0 }
flippedCards = []
```

**User clicks card 0:**

1. Check if maxed: `0 >= 3` → false ✅
2. Check if flipped: `[].includes(0)` → false ✅
3. Add to flipped: `[0]`
4. Set as selected: `selectedCardIndex = 0`
5. Increment counter: `timesSelected: 0 + 1 = 1`

**After Click:**
```javascript
cardOptions[0] = { name: 'Ace ♠', maxSelections: 3, timesSelected: 1 }
flippedCards = [0]
```

**User clicks card 0 again:**
1. Check if flipped: `[0].includes(0)` → true ❌
2. Return (do nothing)

### Card Rendering (Lines 377-420)

```javascript
{cardOptions.map((card, index) => {
  const isFlipped = flippedCards.includes(index);
  const isMaxedOut = card.timesSelected >= card.maxSelections;

  return (
    <div
      key={index}
      className={`flip-card ${isFlipped ? 'flipped' : ''} ${isMaxedOut ? 'maxed-out' : ''}`}
      onClick={() => handleCardClick(index)}
    >
      <div className="flip-card-inner">
        {/* Front Side (face down) */}
        <div className="flip-card-front">
          <div className="card-back-design">
            <div className="card-pattern">🃏</div>
            <div className="card-number">{index + 1}</div>
          </div>
        </div>

        {/* Back Side (face up) */}
        <div className="flip-card-back">
          <div className="card-answer">
            {card.name}
          </div>
          <div className="card-selection-count">
            {card.maxSelections === Infinity
              ? `${card.timesSelected}/∞`
              : `${card.timesSelected}/${card.maxSelections}`}
          </div>
        </div>
      </div>
    </div>
  );
})}
```

**CSS Flip Animation:**

```css
.flip-card {
  perspective: 1000px;
}

.flip-card-inner {
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.flip-card.flipped .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front {
  backface-visibility: hidden;
}

.flip-card-back {
  backface-visibility: hidden;
  transform: rotateY(180deg);
}
```

**How it works:**
1. Card has front and back faces
2. Both faces are positioned on top of each other
3. Back face is rotated 180° initially (invisible)
4. When `.flipped` class added → rotate entire card 180°
5. Front face now rotated away (invisible)
6. Back face now facing forward (visible)

**Visual:**

```
BEFORE FLIP (Front visible):
   ┌──────────┐
   │    🃏    │  ← Front
   │    1     │
   └──────────┘

FLIPPING (180° rotation):
   ╱──────────╲
  │    🃏      │
  │     1      │
   ╲──────────╱

AFTER FLIP (Back visible):
   ┌──────────┐
   │  Ace ♠   │  ← Back
   │   1/3    │
   └──────────┘
```

### Swipe Gesture Support (Lines 217-258)

For mobile devices, cards support swipe gestures:

```javascript
const handleSwipeStart = (e, index) => {
  const card = cardOptions[index];

  if (card.timesSelected >= card.maxSelections) return;
  if (flippedCards.includes(index)) return;

  const touch = e.touches ? e.touches[0] : e;
  setSwipeStart({ x: touch.clientX, y: touch.clientY });
  setIsSwiping(true);
  setSwipingCardIndex(index);
};

const handleSwipeMove = (e, index) => {
  if (!isSwiping || swipingCardIndex !== index) return;

  const touch = e.touches ? e.touches[0] : e;
  setSwipeEnd({ x: touch.clientX, y: touch.clientY });
};

const handleSwipeEnd = (e, index) => {
  if (!isSwiping || swipingCardIndex !== index) return;

  const deltaX = swipeEnd.x - swipeStart.x;
  const deltaY = swipeEnd.y - swipeStart.y;
  const swipeDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  const minSwipeDistance = 50;

  if (swipeDistance > minSwipeDistance) {
    handleCardClick(index);
  }

  setIsSwiping(false);
  setSwipingCardIndex(null);
};
```

**Swipe Detection:**
1. **Start**: Record touch position
2. **Move**: Update end position
3. **End**: Calculate distance
4. If distance > 50px → flip card

**Distance Formula:**
```
distance = √(deltaX² + deltaY²)

Example:
Start: (100, 200)
End: (180, 240)
deltaX = 180 - 100 = 80
deltaY = 240 - 200 = 40
distance = √(80² + 40²) = √(6400 + 1600) = √8000 ≈ 89px

89px > 50px → Flip card ✅
```

---

## 8. Color Picker Component

### Spinning Color Wheel

**File:** `src/components/ColorPicker.js`

### State Management (Lines 8-14)

```javascript
const [colors, setColors] = useState([
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
  '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
]);
const [newColor, setNewColor] = useState('');
const [isSpinning, setIsSpinning] = useState(false);
const [rotation, setRotation] = useState(0);
const [selectedColor, setSelectedColor] = useState(null);
```

### Wheel Rendering (Lines 67-98)

```javascript
<div className="color-wheel-container">
  <div className="color-wheel" style={{ transform: `rotate(${rotation}deg)` }}>
    {colors.map((color, index) => {
      const rotation = (360 / colors.length) * index;
      const sectorSize = 360 / colors.length;

      return (
        <div
          key={index}
          className="color-sector"
          style={{
            backgroundColor: color,
            transform: `rotate(${rotation}deg)`,
            clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.sin((sectorSize * Math.PI) / 180)}% ${50 - 50 * Math.cos((sectorSize * Math.PI) / 180)}%)`
          }}
        />
      );
    })}
  </div>

  <button
    className="wheel-center"
    onClick={spinWheel}
    disabled={isSpinning || colors.length === 0}
  >
    {isSpinning ? '...' : 'SPIN'}
  </button>
</div>
```

**clipPath Calculation:**

For each color sector, calculate triangular slice:

```
If 8 colors:
sectorSize = 360 / 8 = 45°

For color at index 2:
rotation = 45 * 2 = 90°

clipPath creates triangle:
- Point 1: Center (50%, 50%)
- Point 2: Top (50%, 0%)
- Point 3: Arc edge (calculated with trig)
```

**Visual:**
```
        ┌────┐
        │ 🎨 │ ← Center button
     ╔══╪════╪══╗
   ╔═╝  │    │  ╚═╗
  ║ Red │Blue│ Gre║
  ║─────┼────┼────║
  ║Yellow│Purp│Ora║
   ╚═╗  │  │  ╔═╝
     ╚══╪══╪══╝
        │  │
        └──┘
```

### Spin Function (Lines 34-58)

```javascript
const spinWheel = () => {
  if (isSpinning || colors.length === 0) return;

  setIsSpinning(true);
  setSelectedColor(null);

  const spins = 5 + Math.floor(Math.random() * 3);
  const extraRotation = Math.floor(Math.random() * 360);
  const totalRotation = rotation + (spins * 360) + extraRotation;

  setRotation(totalRotation);

  setTimeout(() => {
    const normalizedRotation = totalRotation % 360;
    const sectorAngle = 360 / colors.length;
    const selectedIndex = Math.floor((360 - normalizedRotation + (sectorAngle / 2)) / sectorAngle) % colors.length;

    setSelectedColor(colors[selectedIndex]);
    setIsSpinning(false);
  }, 3000);
};
```

**Winner Calculation:**
```
If 8 colors (45° each):
Final rotation: 234°

Adjust to pointer at top:
(360 - 234 + 22.5) / 45 = 148.5 / 45 = 3.3
floor(3.3) = 3

Winner: colors[3]
```

### Quick Random (Lines 60-64)

```javascript
const pickRandomColor = () => {
  if (colors.length === 0) return;
  const randomIndex = Math.floor(Math.random() * colors.length);
  setSelectedColor(colors[randomIndex]);
};
```

**No spinning, instant result**

---

## 9. Team Assignment Component

### File Upload & Processing

**File:** `src/components/TeamAssignment.js`

### Excel File Handler (Lines 86-146)

```javascript
const handleFileUpload = (e) => {
  setError('');
  const file = e.target.files[0];

  if (!file) return;

  // Validate file
  const fileValidation = validateExcelFile(file);
  if (!fileValidation.valid) {
    setError(fileValidation.error);
    e.target.value = '';
    return;
  }

  const reader = new FileReader();

  reader.onerror = () => {
    setError('Error reading file. Please try again.');
    e.target.value = '';
  };

  reader.onload = (event) => {
    try {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

      // Extract names from first column
      const extractedNames = jsonData
        .map(row => row[0])
        .filter(name => name && String(name).trim())
        .map(name => String(name).trim());

      // Validate all names
      const validation = validateNamesList(extractedNames, SECURITY_LIMITS.MAX_OPTIONS_COUNT);

      if (!validation.valid) {
        setError(validation.errors.join(', '));
        e.target.value = '';
        return;
      }

      setNames(validation.sanitized);
    } catch (error) {
      setError('Error reading file. Please make sure it\'s a valid Excel file.');
      console.error('File read error:', error);
    }

    e.target.value = '';
  };

  reader.readAsArrayBuffer(file);
};
```

**Excel Processing Steps:**

**Example Excel File:**
```
┌───────────┬───────────┐
│   Name    │   Email   │
├───────────┼───────────┤
│ John Doe  │ john@...  │
│ Jane Smith│ jane@...  │
│ Bob Lee   │ bob@...   │
└───────────┴───────────┘
```

**Step 1: Read File**
```javascript
const reader = new FileReader();
reader.readAsArrayBuffer(file);
```
Converts file to binary data

**Step 2: Parse with xlsx library**
```javascript
const data = new Uint8Array(event.target.result);
const workbook = XLSX.read(data, { type: 'array' });
```
Reads Excel format

**Step 3: Get first sheet**
```javascript
const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
```
Converts to JavaScript array:
```javascript
[
  ['Name', 'Email'],
  ['John Doe', 'john@...'],
  ['Jane Smith', 'jane@...'],
  ['Bob Lee', 'bob@...']
]
```

**Step 4: Extract first column only**
```javascript
const extractedNames = jsonData
  .map(row => row[0])          // Get first column
  .filter(name => name && String(name).trim())  // Remove empty
  .map(name => String(name).trim());  // Clean whitespace
```
Result:
```javascript
['Name', 'John Doe', 'Jane Smith', 'Bob Lee']
```

**Step 5: Validate and sanitize**
```javascript
const validation = validateNamesList(extractedNames, 1000);
```
- Removes 'Name' (header)
- Sanitizes HTML
- Checks length limits
- Returns clean array

### Team Assignment Algorithm (Lines 174-209)

```javascript
const assignTeams = () => {
  setError('');

  if (names.length === 0) {
    setError('Please add names first!');
    return;
  }

  const teamValidation = validateNumber(numTeams, 1, Math.min(names.length, 100));
  if (!teamValidation.valid) {
    setError(teamValidation.error);
    return;
  }

  setIsAnimating(true);

  setTimeout(() => {
    const shuffled = shuffleArray(names);
    const teamSize = Math.floor(shuffled.length / numTeams);
    const remainder = shuffled.length % numTeams;

    const newTeams = [];
    let currentIndex = 0;

    for (let i = 0; i < numTeams; i++) {
      const extraMember = i < remainder ? 1 : 0;
      const membersCount = teamSize + extraMember;
      newTeams.push(shuffled.slice(currentIndex, currentIndex + membersCount));
      currentIndex += membersCount;
    }

    setTeams(newTeams);
    setIsAnimating(false);
  }, 1000);
};
```

**Example:**

**Input:**
```javascript
names = ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace', 'Henry']
numTeams = 3
```

**Step 1: Shuffle**
```javascript
shuffled = ['Grace', 'Bob', 'Henry', 'Alice', 'Frank', 'Charlie', 'Eve', 'David']
```

**Step 2: Calculate sizes**
```javascript
teamSize = floor(8 / 3) = 2
remainder = 8 % 3 = 2
```

**Step 3: Distribute**
```
Team 1: 2 + 1 = 3 members (gets extra)
Team 2: 2 + 1 = 3 members (gets extra)
Team 3: 2 + 0 = 2 members (no extra)
```

**Result:**
```javascript
[
  ['Grace', 'Bob', 'Henry'],        // Team 1: 3 members
  ['Alice', 'Frank', 'Charlie'],    // Team 2: 3 members
  ['Eve', 'David']                  // Team 3: 2 members
]
```

**Algorithm ensures:**
- Each team has similar size
- Extra people distributed evenly
- First `remainder` teams get +1 member

---

## 10. Dice Roller Component

### Rolling Animation (Lines 116-157)

```javascript
const rollDice = () => {
  if (isRolling || diceOptions.length === 0) return;

  const availableOptions = diceOptions.filter(opt => opt.timesSelected < opt.maxSelections);
  if (availableOptions.length === 0) {
    alert('All dice options have been used up! Please reset or add new options.');
    return;
  }

  setIsRolling(true);
  setDiceResult(null);

  let rollCount = 0;
  const rollInterval = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * availableOptions.length);
    setDiceResult(availableOptions[randomIndex].name);
    rollCount++;

    if (rollCount >= 15) {
      clearInterval(rollInterval);

      const randomIndex = Math.floor(Math.random() * availableOptions.length);
      let selectedOpt = availableOptions[randomIndex];

      const selectedIndex = diceOptions.findIndex(opt => opt.name === selectedOpt.name);

      const updatedOptions = diceOptions.map((opt, idx) => {
        if (idx === selectedIndex && opt.timesSelected < opt.maxSelections) {
          return {
            ...opt,
            timesSelected: opt.timesSelected + 1
          };
        }
        return opt;
      });

      setDiceOptions(updatedOptions);
      setDiceResult(selectedOpt.name);
      setIsRolling(false);
    }
  }, 100);
};
```

**Animation Timeline:**

```
Time 0ms:     ┌────┐
              │ 🎲 │
              └────┘

Time 100ms:   ┌────┐
              │ 1️⃣ │ ← Random option 1
              └────┘

Time 200ms:   ┌────┐
              │ 4️⃣ │ ← Random option 2
              └────┘

Time 300ms:   ┌────┐
              │ 2️⃣ │ ← Random option 3
              └────┘

... (continues for 1.5 seconds)

Time 1500ms:  ┌────┐
              │ 5️⃣ │ ← Final result (stays)
              └────┘
```

**How it works:**
1. **Every 100ms**: Show random option
2. **After 15 iterations** (1.5 seconds): Stop
3. **Select final winner** and update counter

---

## 11. Utility Functions

### Security Utilities

**File:** `src/utils/security.js`

### Key Functions Overview

```javascript
sanitizeHTML(dirty)              // Remove all HTML tags
sanitizeTextInput(input)         // Full text sanitization
validateOptionName(name)         // Validate wheel/card option
validateExcelFile(file)          // Check file type & size
validateNamesList(names)         // Validate array of names
validateNumber(value, min, max)  // Validate numeric input
rateLimiter.checkLimit(key)      // Rate limiting
secureStore(key, value)          // Safe localStorage write
secureRetrieve(key)              // Safe localStorage read
```

### Example: Complete Validation Flow

```javascript
// User types: <script>alert('XSS')</script>John Doe

// Step 1: validateOptionName()
const validation = validateOptionName(userInput);

// Step 2: Inside validateOptionName() → calls sanitizeTextInput()
const sanitized = sanitizeTextInput(userInput, 200);

// Step 3: Inside sanitizeTextInput() → calls sanitizeHTML()
const cleaned = sanitizeHTML(userInput);
// Result: "John Doe" (script tags removed)

// Step 4: Trim and check length
cleaned.trim();  // "John Doe"
cleaned.length;  // 8 (valid)

// Step 5: Return
return { valid: true, sanitized: "John Doe" };
```

---

## 12. Firebase Configuration

### Firebase Setup

**File:** `src/firebase.js`

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};
```

### Environment Variables

**File:** `.env`
```
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef
```

**Why use environment variables:**
- Keep secrets out of code
- Different configs for dev/prod
- Don't commit to git

---

## 13. CSS Architecture

### Theme System

**App.css**

```css
:root {
  /* Light Theme */
  --bg-color-light: #f5f5f5;
  --text-color-light: #333;
  --primary-color: #6366f1;
  --secondary-color: #8b5cf6;

  /* Dark Theme */
  --bg-color-dark: #1a1a2e;
  --text-color-dark: #eee;
}

.light-theme {
  background-color: var(--bg-color-light);
  color: var(--text-color-light);
}

.dark-theme {
  background-color: var(--bg-color-dark);
  color: var(--text-color-dark);
}
```

### Animation Keyframes

```css
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
  20%, 40%, 60%, 80% { transform: translateX(10px); }
}

@keyframes flipIn {
  from {
    transform: rotateY(0deg);
  }
  to {
    transform: rotateY(180deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 768px) {
  .desktop-menu {
    display: none;
  }
  .mobile-menu {
    display: block;
  }
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
  .container {
    max-width: 900px;
  }
}

/* Desktop */
@media (min-width: 1025px) {
  .mobile-menu {
    display: none;
  }
}
```

---

## 14. How Everything Works Together

### Complete User Journey

```
┌─────────────────────────────────────────────────────────────┐
│  USER OPENS https://your-app.com                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  REACT APP INITIALIZATION                                   │
│  1. App.js renders                                          │
│  2. Initialize Firebase                                     │
│  3. Initialize Google Analytics                             │
│  4. Set up auth listener                                    │
│  5. Load dark mode from localStorage                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  RENDER HOME PAGE                                           │
│  <Navigation> <LandingPage> <Footer>                        │
│                                                             │
│  User sees:                                                 │
│  ┌──────────────────────────────────────┐                  │
│  │ 🎡 Random Me  [☀️] [Sign in] [☰]    │ ← Navigation     │
│  ├──────────────────────────────────────┤                  │
│  │                                      │                  │
│  │   Welcome to Random Me               │                  │
│  │   Choose your tool:                  │ ← Landing Page   │
│  │   [🎲 Spinning Wheel]               │                  │
│  │   [🥢 Fortune Sticks]               │                  │
│  │   [🃏 Card Selector]                │                  │
│  │                                      │                  │
│  ├──────────────────────────────────────┤                  │
│  │  © 2025 Random Me                    │ ← Footer         │
│  └──────────────────────────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  USER CLICKS "SPINNING WHEEL"                               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  REACT ROUTER NAVIGATION                                    │
│  1. URL changes to /wheel                                   │
│  2. AnalyticsTracker logs page view                         │
│  3. Routes component matches /wheel                         │
│  4. SpinningWheel component renders                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  SPINNING WHEEL INITIALIZATION                              │
│  1. Component mounts                                        │
│  2. useEffect: Set up Firebase auth listener                │
│  3. useEffect: Load saved options from localStorage         │
│  4. Default options loaded if none saved                    │
│  5. Render wheel with current state                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  USER INTERACTION: Add Option                               │
│  1. User types "Pizza" in input field                       │
│  2. onChange: setNewOption('Pizza')                         │
│  3. User presses Enter or clicks Add button                 │
│  4. handleAddOption() called                                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  VALIDATION & SANITIZATION                                  │
│  1. validateOptionName('Pizza')                             │
│  2. sanitizeTextInput('Pizza', 200)                         │
│  3. sanitizeHTML('Pizza')                                   │
│  4. DOMPurify removes any HTML                              │
│  5. Return { valid: true, sanitized: 'Pizza' }             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  STATE UPDATE                                               │
│  setOptions([...options, 'Pizza'])                          │
│  options = ['Option 1', 'Option 2', 'Pizza']                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  RE-RENDER                                                  │
│  React detects state change                                 │
│  Component re-renders with new options                      │
│  Wheel now shows 3 segments instead of 2                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  USER CLICKS "SPIN" BUTTON                                  │
│  spinWheel() function called                                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  SPIN ANIMATION                                             │
│  1. setIsSpinning(true) ← Disable button                    │
│  2. Calculate rotation: 5-10 spins + random angle           │
│  3. setRotation(2780) ← Update rotation state               │
│  4. CSS transition: rotate from 0° to 2780° over 4s         │
│  5. playSpinSound() ← Audio feedback                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                    (4 seconds pass...)
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  DETERMINE WINNER                                           │
│  1. setTimeout callback fires                               │
│  2. normalizedRotation = 2780 % 360 = 140°                  │
│  3. segmentAngle = 360 / 3 = 120° per option                │
│  4. selectedIndex = floor((360-140) / 120) = 1              │
│  5. setSelectedOption(options[1]) = 'Option 2'              │
│  6. setIsSpinning(false) ← Enable button                    │
│  7. playResultSound() ← Victory sound                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  DISPLAY RESULT                                             │
│  <div className="result">                                   │
│    🎉 Result: Option 2                                      │
│  </div>                                                     │
│                                                             │
│  fadeIn animation plays                                     │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  USER SIGNS IN (Optional)                                   │
│  1. Clicks "Sign in" button                                 │
│  2. handleSignIn() called                                   │
│  3. signInWithGoogle() → Firebase popup                     │
│  4. User authenticates with Google                          │
│  5. onAuthStateChanged fires                                │
│  6. setUser(currentUser)                                    │
│  7. Navigation shows user photo & name                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  SAVE TO FIREBASE (Now Available)                           │
│  1. User enters wheel name: "Lunch Choices"                 │
│  2. Clicks "💾 Save" button                                 │
│  3. handleSaveWheel() called                                │
│  4. Check user signed in ✅                                 │
│  5. addDoc(collection(db, 'wheels'), {...})                │
│  6. Document saved to Firestore                             │
│  7. Alert: "Wheel saved successfully! ✅"                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  LOAD SAVED WHEEL (Later)                                   │
│  1. User clicks "📂 Load" button                            │
│  2. Show saved wheels list                                  │
│  3. User clicks "Lunch Choices"                             │
│  4. handleLoadWheel(wheel) called                           │
│  5. setWheelName('Lunch Choices')                           │
│  6. setOptions(['Pizza', 'Burger', 'Sushi'])                │
│  7. Component re-renders with loaded data                   │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow Summary

```
┌───────────────┐
│     USER      │
└───────┬───────┘
        │ types input
        ▼
┌───────────────┐
│  COMPONENT    │
│  (React)      │
│  - State      │
│  - Handlers   │
└───────┬───────┘
        │ calls
        ▼
┌───────────────┐
│   SECURITY    │
│   UTILITIES   │
│   - Validate  │
│   - Sanitize  │
└───────┬───────┘
        │ returns clean data
        ▼
┌───────────────┐
│  STATE UPDATE │
│  setOptions() │
└───────┬───────┘
        │ triggers
        ▼
┌───────────────┐
│   RE-RENDER   │
│   (React)     │
└───────┬───────┘
        │ updates
        ▼
┌───────────────┐
│   DOM/CSS     │
│   (Browser)   │
└───────┬───────┘
        │ shows
        ▼
┌───────────────┐
│     USER      │
│  sees result  │
└───────────────┘
```

---

## Conclusion

This document provides a complete explanation of every major component and feature in the Random Me application. Each section includes:

✅ **Code walkthroughs** with line-by-line explanations
✅ **Visual diagrams** showing data flow
✅ **Math calculations** for animations
✅ **State management** patterns
✅ **Security implementations**
✅ **CSS animations** and styling
✅ **Firebase integration**
✅ **Complete user journeys**

Use this as a reference guide for:
- Understanding the codebase
- Learning React patterns
- Implementing similar features
- Teaching others
- Interview preparation
- Portfolio documentation

---

**Document Version:** 1.0
**Last Updated:** December 4, 2025
**Author:** Complete Code Documentation
**Project:** Random Me - Random Selection Tools

---

## Additional Resources

### Converting to PDF

1. **VS Code**: Open preview → Print → Save as PDF
2. **Pandoc**: `pandoc CODE_EXPLANATION.md -o CODE_EXPLANATION.pdf`
3. **Online**: Upload to https://www.markdowntopdf.com/
4. **Chrome**: Open in browser → Print → Save as PDF

### Learning More

- **React Documentation**: https://react.dev
- **Firebase Documentation**: https://firebase.google.com/docs
- **MDN Web Docs**: https://developer.mozilla.org
- **React Router**: https://reactrouter.com

### Project Repository

GitHub: (your repository URL)
Live Demo: (your deployed URL)
