# Resume Submission and Review Platform

A comprehensive web-based platform for submitting resumes and receiving professional feedback from reviewers.

## Features

### Core Features
- **Resume Upload**: Drag & drop interface with PDF preview before submission
- **Status Dashboard**: Track your resume status (Approved/Needs Revision/Rejected)
- **Admin Panel**: Review resumes, assign scores, and provide detailed feedback
- **Magic Link Authentication**: Passwordless authentication via email
- **Leaderboard**: Public leaderboard showcasing top-scoring resumes

### Technical Highlights
- TypeScript for type safety
- File validation (PDF only, max 10MB)
- Real-time status updates
- Responsive design for mobile and desktop
- Role-based access control (user/admin)

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes, Server Actions
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Magic Links)
- **Storage**: Supabase Storage (or base64 fallback)
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 18+ 
- Supabase account
- Vercel account (for deployment)

### Installation

1. Clone the repository:
\`\`\`bash
git clone <your-repo-url>
cd resume-platform
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
Create a `.env.local` file with:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
\`\`\`

4. Set up the database:
- Go to your Supabase project
- Run the SQL scripts in the `scripts/` folder in order:
  - `01-create-tables.sql`
  - `02-seed-admin.sql` (update the admin email first)

5. Create a storage bucket:
- In Supabase, create a public bucket named `resumes`
- Set appropriate policies for authenticated uploads

6. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

7. Open [http://localhost:3000](http://localhost:3000)

### First Admin User

Update the email in `scripts/02-seed-admin.sql` before running it to create your first admin user.

## Project Structure

\`\`\`
├── app/
│   ├── admin/              # Admin panel pages
│   ├── auth/               # Authentication pages
│   ├── dashboard/          # User dashboard
│   ├── leaderboard/        # Public leaderboard
│   └── api/                # API routes
├── components/             # React components
├── lib/
│   ├── actions/            # Server actions
│   ├── supabase/           # Supabase clients
│   ├── utils/              # Utility functions
│   └── types.ts            # TypeScript types
├── scripts/                # Database scripts
└── middleware.ts           # Auth middleware
\`\`\`

## Key Design Decisions

### Authentication
- **Magic Links**: Chose passwordless authentication for better UX and security
- **Supabase Auth**: Leverages built-in email verification and session management

### File Storage
- **Supabase Storage**: Primary method for production with proper CDN support
- **Base64 Fallback**: Allows development without storage integration (not recommended for production)

### Database Schema
- **Row Level Security**: Implemented for data protection
- **Indexes**: Added on frequently queried columns for performance
- **Triggers**: Automatic timestamp updates

### UI/UX
- **Drag & Drop**: Intuitive file upload experience
- **PDF Preview**: Users can verify their resume before submission
- **Status Badges**: Clear visual indicators for review status
- **Responsive Design**: Mobile-first approach

## Future Improvements

### Short Term
- Email notifications when status changes
- Resume version history
- Bulk review actions for admins
- Advanced filtering and search

### Long Term
- AI-powered resume analysis
- Resume templates and builder
- Interview scheduling integration
- Analytics dashboard for admins
- Multi-language support
- Resume comparison tool

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
\`\`\`

## Edge Cases Handled

- **File Validation**: Only PDFs accepted, size limit enforced
- **Duplicate Uploads**: Users can upload multiple versions
- **Invalid Magic Links**: Proper error handling and user feedback
- **Unauthorized Access**: Middleware protects admin routes
- **Missing Data**: Graceful fallbacks for optional fields
- **Large Files**: Size validation prevents server overload

## License

MIT

## Support

For issues or questions, please open a GitHub issue or contact the development team.
