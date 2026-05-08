# ExperienceYourTravel: AI Trip Planner

This plan outlines the architecture and steps to build a simple, premium-looking web application that helps users plan trips and generate tailored itineraries using AI, specifically optimized for the Promptwars hackathon.

## Hackathon Optimization Focus
Based on the judging criteria, the implementation will prioritize:
1. **Code Quality:** Modular, clean components using Next.js App Router.
2. **Security:** Protecting API keys (Gemini API) by keeping calls on the server side (Next.js API routes) and securely implementing Firebase Authentication.
3. **Efficiency:** Leveraging Next.js Server Components for faster loads and minimizing bundle size (vital for the <=10MB requirement).
4. **Testing:** Including a basic test suite (e.g., using Jest) to validate core logic and demonstrate testing practices.
5. **Accessibility:** Using semantic HTML, ARIA attributes, and high-contrast color palettes.
6. **Google Services:** Integrating Firebase (Auth & Hosting) and Google Gemini (AI agent).

## Proposed Architecture & Tech Stack

1. **Framework:** Next.js (App Router)
2. **Styling:** Vanilla CSS with a premium, accessible, and dynamic design (glassmorphism, modern typography).
3. **Authentication:** Firebase Authentication (Phone Number Login).
4. **AI Agent:** Google Gemini API (`@google/generative-ai`).
5. **Deployment:** Firebase Hosting.
6. **Testing:** Jest + React Testing Library.

## Proposed Changes

### Setup and Configuration
- **Next.js Initialization:** Scaffold a new Next.js project.
- **Dependencies:** Install `firebase`, `@google/generative-ai`, and setup `jest`.
- **Firebase Configuration:** Set up Firebase client-side SDK.

### Frontend Components (App Router)
#### [NEW] `app/page.js`
The landing page containing the login UI and a beautiful hero section. Fully accessible and responsive.

#### [NEW] `app/planner/page.js`
The main preference collection form. It will collect:
- Travel duration (Start/End Date)
- Companions
- Experience type
- Transportation
- Stay preferences
- Food preferences
- Budget

#### [NEW] `app/itinerary/page.js`
The results page displaying the AI-generated itinerary.

#### [NEW] `app/globals.css`
A comprehensive stylesheet containing our premium design system.

### Backend / API
#### [NEW] `app/api/generate-itinerary/route.js`
A Next.js API route that securely calls the Google Gemini API with the user's preferences, protecting the API key from the client.

### Tests
#### [NEW] `__tests__/Home.test.js`
Basic rendering tests to demonstrate adherence to the "Testing" criteria.

## Verification Plan

### Automated Tests
- Run `npm test` to ensure components pass accessibility and rendering tests.
- Build verification (`npm run build`).

### Manual Verification
1. Run the local dev server (`npm run dev`).
2. Test the Firebase Phone Authentication flow.
3. Verify that the UI is accessible via keyboard and screen reader.
4. Submit the form and verify that the API route successfully calls Gemini and returns a relevant itinerary.
5. Verify project size is under 10MB (ignoring `node_modules` and `.next`).
