# Bank Management System - Frontend

Modern Next.js frontend for the Bank Management System.

## Features

- ⚡ Next.js 14 with App Router
- 🎨 Tailwind CSS for styling
- 📱 Fully responsive design
- 🔄 Real-time data fetching
- 🎯 TypeScript for type safety
- 🔔 Toast notifications
- 🎭 Modern UI with gradients and animations

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Django backend running on `http://127.0.0.1:8000`

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` file:
   ```bash
   cp .env.local.example .env.local
   ```

4. Update `.env.local` if your Django backend is running on a different URL:
   ```
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── accounts/          # Account pages
│   ├── transfer/          # Transfer page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Navbar.tsx         # Navigation bar
│   └── StatCard.tsx       # Statistics card
├── lib/                   # Utilities
│   └── api.ts             # API client
└── public/                # Static files
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## API Integration

The frontend communicates with the Django REST API backend. All API calls are handled through the `lib/api.ts` file.

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library

