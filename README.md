# AI Learning Hub - Interactive AI Education

An interactive AI learning platform built with Next.js, React, Tailwind CSS, and Firebase/Firestore. Learn about artificial intelligence through curated learning goals and engaging AI character conversations.

## Features

- **Collapsible Learning Goals Sidebar** - Browse AI topics organized by category (Basics, ML, NLP, Ethics, Applications)
- **Interactive AI Dialogue** - Watch Alex (learner) and Sam (AI expert) discuss AI concepts
- **Topic Selection** - Click any learning goal to focus your learning journey
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Dark Mode Support** - Automatic dark mode based on system preference
- **Modern UI** - Beautiful gradient designs and smooth animations

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Deployment**: Vercel-ready

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Copy `.env.local.example` to `.env.local`
4. Fill in your Firebase configuration values

```bash
cp .env.local.example .env.local
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Firebase Setup

### Firestore Rules

For development, you can use these permissive rules (update for production):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow read, write: if true;
    }
  }
}
```

### Collection Structure

The app uses a `tasks` collection with the following document structure:

```typescript
{
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## Deploy on Vercel

1. Push your code to GitHub
2. Import the project on [Vercel](https://vercel.com/new)
3. Add your environment variables in Vercel's project settings
4. Deploy!

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── TaskList.tsx      # Task list with CRUD operations
│   ├── TaskCard.tsx      # Individual task card
│   └── TaskForm.tsx      # Task creation/edit form
├── lib/
│   ├── firebase.ts       # Firebase initialization
│   └── firestore.ts      # Firestore CRUD operations
└── types/
    └── task.ts           # TypeScript interfaces
```
