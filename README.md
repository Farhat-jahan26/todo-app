# Todo App with Authentication

A full-stack todo application with user authentication, allowing users to sign up, log in, and manage their personal task list in real-time.

## Features
- User authentication (Sign up / Login) using Firebase Auth
- Add, complete, and delete tasks
- Real-time sync — tasks update instantly across sessions
- Each user sees only their own tasks (secured by user ID)

## Tech Stack
- **Frontend:** Next.js, React
- **Backend/Database:** Firebase Authentication, Firestore
- **Deployment:** Vercel

## Getting Started

1. Clone the repo

git clone https://github.com/Farhat-jahan26/todo-app.git

2. Install dependencies

npm install

3. Add your Firebase config in a `.env.local` file:

NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

4. Run the development server

npm run dev

   ## Live Demo
   https://todo-app-delta-five-62.vercel.app/