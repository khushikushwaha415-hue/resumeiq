# ResumeIQ

An AI-powered resume analyzer that matches resumes against job descriptions and provides actionable feedback — built with the MERN stack and Google Gemini AI.

## Features

- **AI-Powered Analysis** — Upload a resume (PDF) and a job description to get an instant match score, powered by Gemini AI
- **Detailed Feedback** — See matched keywords, missing keywords, strengths, and specific improvement suggestions
- **User Authentication** — Secure signup/login with JWT-based authentication
- **Analysis History** — All past analyses are saved and viewable per user
- **Clean, Responsive UI** — Built with React and Tailwind CSS

## Tech Stack

**Frontend:** React (Vite), Tailwind CSS, React Router, Axios

**Backend:** Node.js, Express, MongoDB (Mongoose)

**AI:** Google Gemini API

**Auth:** JWT, bcrypt

## How It Works

1. User signs up / logs in
2. User uploads a resume (PDF) and pastes a job description
3. Backend extracts text from the PDF and sends it, along with the job description, to Gemini AI
4. Gemini analyzes the fit and returns a structured response: match score, matched/missing keywords, strengths, and suggestions
5. Result is saved to the user's history and displayed on the dashboard

## Screenshots

*(Add screenshots here after uploading them to the repo)*

## Getting Started

### Prerequisites
- Node.js
- MongoDB (local or Atlas)
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Backend Setup
```bash
npm install
```

Create a `.env` file in the root with:
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key

CLIENT_URL=http://localhost:5173

Run the server:
```bash
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Future Improvements

- Resume version comparison
- Export analysis as PDF
- Support for DOCX resumes
- Multi-language support

## Author

Built by Khushi Kushwaha
