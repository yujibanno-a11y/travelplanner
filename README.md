travelplanner

## Environment Variables Setup

This project requires the following environment variables to be set in your deployment platform:

### Required Environment Variables:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### How to get these values:

1. **VITE_SUPABASE_URL**: 
   - Go to your Supabase project dashboard
   - Navigate to Settings > API
   - Copy the "Project URL"

2. **VITE_SUPABASE_ANON_KEY**:
   - In the same API settings page
   - Copy the "anon public" key

### Setting up in Netlify:

1. Go to your Netlify site dashboard
2. Navigate to Site settings > Environment variables
3. Add the two environment variables above
4. Redeploy your site

### Local Development:

For local development, create a `.env` file in the root directory with:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Note**: The `.env` file is gitignored for security reasons.

## Features

- **Trip Planning**: AI-generated itineraries with day-by-day activities
- **Budget Tracking**: Set budgets and track expenses with real-time alerts
- **Expense Management**: Natural language expense entry with AI chat assistant
- **Restaurant Recommendations**: Filter restaurants by budget and cuisine
- **User Authentication**: Secure login/signup with Supabase
- **Cloud Sync**: Save your data across devices when logged in
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS with custom glass morphism design
- **Animation**: Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Netlify
- **3D Graphics**: Three.js + React Three Fiber
