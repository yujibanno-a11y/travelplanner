# TravelPlanner - Secure Multi-User Travel Planning App

A comprehensive travel planning application with secure user authentication and per-user data isolation.

## Features

- **Secure Authentication**: Email/password authentication with Supabase Auth
- **Per-User Data Isolation**: Each user only sees their own data using Row Level Security (RLS)
- **Trip Planning**: AI-powered itinerary generation
- **Budget Tracking**: Set budgets and track expenses by category
- **Expense Management**: Natural language expense entry with chat interface
- **Restaurant Recommendations**: Budget-aware restaurant suggestions
- **Notifications**: Real-time budget alerts and summaries
- **Data Export**: Export expenses to CSV

## Security Features

- **Row Level Security (RLS)**: Database-level data isolation
- **JWT Authentication**: Secure session management with HttpOnly cookies
- **Input Validation**: Server-side validation on all endpoints
- **CSRF Protection**: Built-in protection against cross-site request forgery
- **Password Security**: Secure password hashing with Supabase Auth

## Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **Authentication**: Supabase Auth with email/password
- **Database**: PostgreSQL with Row Level Security
- **Icons**: Lucide React
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd travelplanner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Run the migration script in the Supabase SQL editor:
     ```sql
     -- Copy and paste the contents of supabase/migrations/001_create_auth_tables.sql
     ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## Database Schema

### Tables

- **profiles**: User profile information linked to auth.users
- **itineraries**: User travel itineraries with owner isolation
- **expenses**: User expenses linked to itineraries
- **budget_settings**: User budget preferences and limits
- **notifications**: User-specific notifications and alerts

### Row Level Security Policies

All tables have RLS enabled with policies ensuring users can only:
- Read their own data (`owner_id = auth.uid()`)
- Insert data with their own user ID
- Update/delete only their own records

## Authentication Flow

1. **Sign Up**: Users create accounts with email/password
2. **Email Verification**: Optional email confirmation (configurable)
3. **Sign In**: Secure authentication with JWT tokens
4. **Session Management**: Automatic token refresh and session persistence
5. **Password Reset**: Secure password reset via email

## Data Migration

The migration script (`001_create_auth_tables.sql`) safely:
- Creates all necessary tables with proper foreign keys
- Enables RLS on all tables
- Sets up authentication triggers
- Provides rollback capability

## Testing

### Manual Testing Checklist

- [ ] Anonymous users cannot access protected routes (redirected to sign-in)
- [ ] Users can sign up with email/password
- [ ] Users can sign in and access their dashboard
- [ ] Users only see their own itineraries and expenses
- [ ] Attempting to access another user's data returns 403/404
- [ ] Budget alerts work correctly
- [ ] Data export includes only user's data
- [ ] Sign out works and clears session

### Security Testing

- [ ] SQL injection protection (parameterized queries)
- [ ] XSS protection (input sanitization)
- [ ] CSRF protection (SameSite cookies)
- [ ] Session security (HttpOnly, Secure flags)
- [ ] Rate limiting on auth endpoints

## Deployment

### Production Checklist

- [ ] Set up production Supabase project
- [ ] Configure production environment variables
- [ ] Enable email confirmation in Supabase Auth settings
- [ ] Set up custom SMTP for emails (optional)
- [ ] Configure proper CORS settings
- [ ] Set up monitoring and logging

### Environment Variables

```bash
# Production
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

## Architecture Decisions

### Why Supabase Auth + RLS?

1. **Security**: Enterprise-grade authentication with built-in security features
2. **Scalability**: Handles user management, sessions, and security automatically
3. **Developer Experience**: Excellent TypeScript support and React integration
4. **Database-Level Security**: RLS ensures data isolation even if application logic fails
5. **Feature Complete**: Includes email verification, password reset, social auth, etc.

### Data Isolation Strategy

- **Row Level Security**: Primary security mechanism at database level
- **User Context**: All queries automatically filtered by `auth.uid()`
- **Foreign Keys**: Proper relationships with cascade deletes
- **Audit Trail**: Automatic timestamps and user tracking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details