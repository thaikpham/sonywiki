Sony Sales Companion App 🚀

A high-tech, mobile-first web application designed for Sony Electronics Vietnam trainers and sales staff. This "Super App" serves as a central hub for product knowledge, sales tools, and AI-powered assistance.

✨ Key Features

1. 🤖 AI Sales Assistant (Gemini Powered)

Smart Script Generation: Instantly generates sales scripts based on product name.

Customer Personas: Tailors the conversation for specific customers (e.g., Gamers, Young Families, Audiophiles).

Tone Control: Adjusts the style from Professional to Friendly/Enthusiastic.

2. 🛠️ Sales Tools Hub

QR Code Generator: Generates dynamic QR codes linking directly to Notion/Wiki documents for customers to scan.

Sony Trivia (Coming Soon): Daily gamified quizzes to improve product knowledge.

3. 📱 Mobile-First "Flagship" UX

Glassmorphism Design: Modern, translucent UI elements mimicking high-end Sony hardware aesthetics.

Touch Optimized: Large touch targets and bottom navigation for easy one-handed use.

Dark/Light Mode: Adaptive interface suitable for showroom environments.

4. 👤 User Personalization

Profile & Stats: Tracks user contributions and badges.

Saved Scripts: Automatically saves generated sales scripts for future reference.

🏗️ Tech Stack

Frontend: React (Vite)

Styling: Tailwind CSS (with custom animations)

Backend/Auth: Firebase (Firestore, Auth)

AI Engine: Google Gemini API (via generateContent)

Icons: Lucide React

🚀 Getting Started

Clone the repository

Install dependencies:

npm install


Environment Setup:
Create a .env file and add your keys:

VITE_GEMINI_API_KEY=your_gemini_api_key


(Note: Firebase config is injected via global variables in the production environment)

Run Development Server:

npm run dev


🤝 Contribution

Designed for Sony Electronics Vietnam Internal Use.
