# Startup Idea Validator Dashboard

A beautiful, interactive dashboard for submitting, browsing, and analyzing startup ideas, built using React, Vite, Tailwind CSS, and Framer Motion.

## Features Completed
1. **Idea Submission**: Users can submit an idea with a Title, Description, Problem Statement, Category, Difficulty (1-5), and Market Potential.
2. **Difficulty Score**: Intuitive slider input for difficulty, rendered with custom color-coded badges on the card.
3. **Market Potential Rating**: Select menu for market potential, reflected with tailored styling on the UI.
4. **Card Dashboard**: A responsive grid showing submitted ideas. Smooth transitions via `framer-motion`.
5. **Idea Filtering & Sort**: Users can filter by Category, Difficulty Level, and Market Potential, and sort by Newest or Popularity.
6. **Search Functionality**: Real-time keyword search checking both titles and descriptions.
7. **Idea Statistics Panel**: A dynamic panel displaying Total Ideas, Top Category, Average Difficulty, and Total Engagement (Votes).
8. **Input Validation**: Form checks prevent empty submissions and duplicate startup titles.

### Bonus Features Included
- **Idea Upvoting System**: Dedicated button on cards to upvote ideas.
- **Trending Ideas Section**: Users can sort by "Popular" to view trending ideas.
- **Animated Card Transitions**: Beautiful pop layouts and fade-ins powered by Framer Motion.
- **Dark Mode Toggle**: Built-in support to switch between light and dark themes using CSS variables and Tailwind.
- **Idea Popularity Score**: Handled via the upvoting/sorting mechanism seamlessly.

## Quick Start
1. Ensure you have Node.js installed.
2. In the `dashboard` directory, install dependencies (if not already done): `npm install`
3. Start the dev server: `npm run dev`
4. Experience the premium UI directly at `http://localhost:5173/`!

## Design Aesthetics
Modern UI practices are incorporated, including glassmorphism on the sticky header, nuanced border and shadow effects, curated HSL color variables, sophisticated micro-animations, and the 'Inter' typeface for pristine legibility.
