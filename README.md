# Resume-Mitra: Professional Resume Review Platform

## 📋 Table of Contents

- [Features](#-features)
- [Architecture Overview](#️-architecture-overview)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Quick Setup](#-quick-setup)
- [Authentication Flow](#-authentication-flow)
- [Key Features](#-key-features-implementation)
- [Future Enhancements](#-future-enhancements)

## 🚀 Features
-  Drag-and-drop PDF upload with instant preview and validation
-  Expert reviewers provide detailed feedback with scoring
-  Track review progress with status updates (Pending, Approved, Needs Revision, Rejected)
-  Competitive ranking system showcasing top-performing resumes
-  Comprehensive dashboard for managing reviews and user requests
-  Secure authentication with Supabase Auth
-  Modern, mobile-first UI built with Tailwind CSS
-  Users can request admin privileges with proper justification



### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│  Next.js 15 App Router                                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │
│  │   Landing   │ │  Dashboard  │ │   Admin     │              │
│  │    Page     │ │    Page     │ │    Panel    │              │
│  └─────────────┘ └─────────────┘ └─────────────┘              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │
│  │  Auth Pages │ │ Leaderboard │ │   Profile   │              │
│  │             │ │    Page     │ │    Page     │              │
│  └─────────────┘ └─────────────┘ └─────────────┘              │
├─────────────────────────────────────────────────────────────────┤
│                    COMPONENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │
│  │ Resume      │ │   Review    │ │  Admin      │              │
│  │  Upload     │ │   Dialog    │ │ Components  │              │
│  └─────────────┘ └─────────────┘ └─────────────┘              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │
│  │ Resume      │ │ Leaderboard │ │   Navbar    │              │
│  │   List      │ │   Table     │ │             │              │
│  └─────────────┘ └─────────────┘ └─────────────┘              │
├─────────────────────────────────────────────────────────────────┤
│                     API LAYER                                  │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │
│  │ Resume      │ │   Auth      │ │  Middleware │              │
│  │ Upload API  │ │  Actions    │ │  (Route     │              │
│  │             │ │             │ │ Protection) │              │
│  └─────────────┘ └─────────────┘ └─────────────┘              │
├─────────────────────────────────────────────────────────────────┤
│                   DATABASE LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │
│  │   Users     │ │   Resumes   │ │ Admin       │              │
│  │   Table     │ │   Table     │ │ Requests    │              │
│  │             │ │             │ │ Table       │              │
│  └─────────────┘ └─────────────┘ └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

### Database Schema

```
┌─────────────────────────────────────────────────────────────────┐
│                        DATABASE SCHEMA                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  USERS TABLE                                                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ id (uuid, PK)                                          │    │
│  │ email (text, unique)                                   │    │
│  │ full_name (text, nullable)                             │    │
│  │ is_admin (boolean, default: false)                     │    │
│  │ created_at (timestamp)                                 │    │
│  │ updated_at (timestamp)                                 │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  RESUMES TABLE                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ id (uuid, PK)                                          │    │
│  │ user_id (uuid, FK → users.id)                          │    │
│  │ file_name (text)                                       │    │
│  │ file_url (text) - Base64 encoded PDF                   │    │
│  │ file_size (integer)                                    │    │
│  │ status (enum: pending, approved, needs_revision,       │    │
│  │         rejected)                                      │    │
│  │ score (integer, nullable)                              │    │
│  │ reviewer_notes (text, nullable)                        │    │
│  │ reviewed_by (uuid, FK → users.id, nullable)            │    │
│  │ reviewed_at (timestamp, nullable)                      │    │
│  │ created_at (timestamp)                                 │    │
│  │ updated_at (timestamp)                                 │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ADMIN_REQUESTS TABLE                                           │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ id (uuid, PK)                                          │    │
│  │ user_id (uuid, FK → users.id)                          │    │
│  │ reason (text)                                          │    │
│  │ status (enum: pending, approved, rejected)             │    │
│  │ reviewed_by (uuid, FK → users.id, nullable)            │    │
│  │ reviewed_at (timestamp, nullable)                      │    │
│  │ admin_notes (text, nullable)                           │    │
│  │ created_at (timestamp)                                 │    │
│  │ updated_at (timestamp)                                 │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## ️ Technology Stack

#### **Next.js 15 with App Router**
-  Chosen for its cutting-edge features and performance optimizations
  -  Reduces client-side JavaScript bundle size
  -  Modern routing with better performance and developer experience
  -  Automatic code splitting, image optimization, and performance monitoring
  - First-class TypeScript integration for type safety

#### **React 19**
-  Latest React version with improved performance and developer experience
  -  Better user experience with non-blocking updates
  -  Enhanced state management capabilities
  - Optimized rendering and memory usage

#### **Tailwind CSS**
-  Utility-first CSS framework for rapid UI development
  - Pre-built utility classes for consistent styling
  -  Mobile-first approach with built-in breakpoints
  -  Easy theming and component customization
  -  Purged CSS for minimal bundle size

#### **Radix UI Components**
  -  Headless, accessible component primitives
  -  Built-in ARIA attributes and keyboard navigation
  -  Unstyled components that can be styled with Tailwind
  -  Consistent behavior across all components
  -  Full TypeScript support with proper type definitions

### Backend Technologies

#### **Supabase**
- Chosen as the backend-as-a-service solution
- Robust, scalable relational database
-  Live data updates without complex WebSocket setup
-  Built-in auth with multiple providers
-  Database-level security policies
-  REST and GraphQL APIs generated automatically
- Built-in file storage capabilities (though we use base64 for simplicity)

#### **Supabase Auth**
-  Integrated authentication solution
-  Passwordless login for better UX
-  Automatic session handling and refresh
-  Industry-standard security practices
-  Built-in user profile management


#### **TypeScript**
-  Static type checking for JavaScript
-  Catch errors at compile time

#### **Zod**
-  TypeScript-first schema validation
- Validate data at runtime with TypeScript types
  

## 🔧 Project Structure

```
Resume-Mitra/
├── app/                          # Next.js App Router pages
│   ├── admin/                    # Admin panel pages
│   ├── api/                      # API routes
│   │   └── resumes/upload/       # Resume upload endpoint
│   ├── auth/                     # Authentication pages
│   ├── dashboard/                # User dashboard
│   ├── leaderboard/              # Leaderboard page
│   ├── profile/                  # User profile page
│   ├── globals.css               # Global styles
│   └── layout.tsx                # Root layout
├── components/                   # Reusable UI components
│   ├── ui/                       # Base UI components (Radix UI)
│   ├── admin-*.tsx              # Admin-specific components
│   ├── resume-*.tsx             # Resume-related components
│   └── *.tsx                    # General components
├── lib/                         # Utility libraries
│   ├── actions/                 # Server actions
│   ├── supabase/               # Supabase client configuration
│   ├── types.ts                # TypeScript type definitions
│   └── utils/                   # Utility functions
├── middleware.ts                # Next.js middleware for auth
└── public/                      # Static assets
```

##  Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. User enters email on login page                            │
│     ↓                                                           │
│  2. Supabase sends magic link to email                         │
│     ↓                                                           │
│  3. User clicks magic link                                     │
│     ↓                                                           │
│  4. Redirected to /auth/callback                               │
│     ↓                                                           │
│  5. Supabase processes authentication                          │
│     ↓                                                           │
│  6. User record created/updated in users table                 │
│     ↓                                                           │
│  7. Session established, redirect to dashboard                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

##  Key Features Implementation

### Resume Upload System
-  Client and server-side validation for PDF files
-  Intuitive file upload interface
-  Instant PDF preview before upload
-  Base64 encoding for simple storage (can be upgraded to Supabase Storage)

### Review System
-  Four-state system (Pending, Approved, Needs Revision, Rejected)
-  0-100 point scoring system
-  Detailed reviewer feedback
-  Comprehensive admin panel for managing reviews

### Leaderboard
- Live leaderboard with top-scoring resumes
-  Competitive ranking based on review scores
-  Optional name display with email fallback



## 🚀 Quick Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation Steps

1. **Clone & Install**
   ```bash
   git clone <repository-url>
   cd Resume-Mitra
   npm install
   ```

2. **Environment Setup**
   Copy the example environment file and fill in your credentials:
   ```bash
   cp env.example .env.local
   ```
   
   Then edit `.env.local` with your actual values:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Site Configuration
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   
   # Email Configuration (SMTP)
   SMTP_EMAIL=your-email@gmail.com
   SMTP_PASSWORD=your_app_password
   ```

3. **Database Setup**
   - Create a new Supabase project
   - Run the SQL schema below in your Supabase SQL editor:

   <details>
   <summary>📋 Click to expand SQL Schema</summary>

   ```sql
   -- Users table
   CREATE TABLE users (
     id UUID REFERENCES auth.users(id) PRIMARY KEY,
     email TEXT UNIQUE NOT NULL,
     full_name TEXT,
     is_admin BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Resumes table
   CREATE TABLE resumes (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     file_name TEXT NOT NULL,
     file_url TEXT NOT NULL,
     file_size INTEGER NOT NULL,
     status TEXT CHECK (status IN ('pending', 'approved', 'needs_revision', 'rejected')) DEFAULT 'pending',
     score INTEGER CHECK (score >= 0 AND score <= 100),
     reviewer_notes TEXT,
     reviewed_by UUID REFERENCES users(id),
     reviewed_at TIMESTAMP WITH TIME ZONE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Admin requests table
   CREATE TABLE admin_requests (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     reason TEXT NOT NULL,
     status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
     reviewed_by UUID REFERENCES users(id),
     reviewed_at TIMESTAMP WITH TIME ZONE,
     admin_notes TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
   ALTER TABLE admin_requests ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
   CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);
   
   CREATE POLICY "Users can view own resumes" ON resumes FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can insert own resumes" ON resumes FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Admins can view all resumes" ON resumes FOR SELECT USING (
     EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
   );
   ```
   </details>

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000)

## 🔮 Future Enhancements

- We can Integrate AI/ML models for automatic resume scoring, ATS compatibility checking, and instant feedback functionality to provide 24/7 analysis.
- Maybe we can add WebSocket integration for live updates, real-time commenting on resume sections, live chat between reviewers and candidates, and push notifications for instant communication.
- We can create comprehensive analytics showing user performance trends, industry-specific insights, success rate tracking etc features.
- Support DOCX/TXT files, build a professional resume builder with industry-specific templates, and add one-click format conversion for broader accessibility.
-  We can implement achievement badges, peer review system, resume challenges, social sharing, referral rewards, and user portfolios to increase engagement and community building.

