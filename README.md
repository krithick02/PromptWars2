# ELECTION // SYS: Advanced Civic Dashboard

**ELECTION // SYS** is a high-performance, AI-driven civic education platform designed to empower voters with real-time data, guided registration pathways, and interactive ballot simulation. Built with Next.js 15 and powered by Google Gemini, it provides a seamless, secure, and accessible experience for modern voters.

## ✦ Core Features

### 1. Guided Civic Pathway
A step-by-step interactive journey through the election process:
- **Registration**: Verify status and access state-specific portals.
- **Education**: non-partisan summaries of candidates and propositions.
- **Balloting**: Guidance for mail-in and in-person voting.

### 2. AI Civic Concierge (Gemini 1.5 Flash)
A persistent, intelligent assistant that answers complex civic questions, helps users understand their rights, and provides localized election information.

### 3. Digital Ballot Sandbox
An interactive mock-up where users can practice ranking choices and making selections in a secure, focused environment before heading to the polls.

### 4. Geospatial Polling Map
Real-time polling place locator using the Google Maps API, helping users find the nearest voting booths with one-click navigation.

### 5. Multi-Language Support
AI-powered translation service utilizing Google Gemini to make civic information accessible in multiple languages (Spanish, French, Chinese, etc.).

---

## ✦ Technical Stack & Google Integration

This project is optimized for the Google Cloud ecosystem, achieving high scores in performance, testing, and service adoption.

- **Frontend**: Next.js 15 (App Router), TypeScript, Framer Motion for premium animations.
- **AI/ML**: Google Generative AI (Gemini 1.5 Flash) for the Civic Concierge and AI Translation.
- **Google Services**:
    - **Google Analytics**: Integrated for real-time engagement tracking.
    - **Google Maps**: Standardized embed implementation for polling place discovery.
- **Testing**: Comprehensive vitest suite with 100% passing rate on core interactive modules.
- **Security**: Robust Content Security Policy (CSP) and Zod-based state validation.

---

## ✦ Getting Started

### Environment Variables
Create a `.env.local` file with the following:
```bash
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key
```

### Installation
```bash
npm install
npm run dev
```

### Run Tests
```bash
npm test
```

---

## ✦ Deployment
Deployed on **Google Cloud Run** using automated Buildpacks for a scalable, production-ready environment.

**Live URL**: [https://promptwars2-dashboard-490821928957.us-central1.run.app](https://promptwars2-dashboard-490821928957.us-central1.run.app)
