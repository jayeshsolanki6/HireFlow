# Shortlist

Shortlist is a full-stack job board that connects candidates with recruiters, with AI-powered resume screening built in on both sides. Recruiters can post jobs, manage applicants, and get instant AI match scores for every candidate. Candidates can browse and save jobs, apply with one click, and check their own resume-to-job fit before applying.

## Features

### Recruiter
- Set up a company profile (logo, about, website) — stored on Cloudinary
- Create, edit, and delete job postings with status control (`open` / `draft`)
- View a list of all applicants per job with their resume, applied date, and current status
- Update application status: `applied → shortlisted → hired / rejected`
- Run AI resume screening on individual applicants or all applicants at once (async, queued via BullMQ)
- View a full applicant detail page including AI analysis: score, recommendation, matching/missing skills, strengths, weaknesses, reasoning
- Recruiter dashboard with job stats and recent application activity

### Candidate
- Register/login as a candidate
- Complete a profile: name, bio, profile photo, and resume PDF — all stored on Cloudinary
- Browse open jobs with real-time search (title, description, requirements), location filter, job type filter, and minimum salary slider
- Save/unsave jobs for later
- Apply to a job with one click (uses resume on file)
- Track application status across all applied jobs
- Run an instant AI resume-vs-job match analysis before applying (score, recommendation, matching/missing skills)

---

## Tech Stack

### Frontend
- **React** + **TypeScript**
- **Zustand** for state management
- **React Router** for routing
- **Tailwind CSS** for styling
- **Axios** for API requests
- **Sonner** for toast notifications
- **Lucide React** for icons

### Backend
- **Node.js** + **Express** + **TypeScript**
- **PostgreSQL** with **Drizzle ORM**
- **Zod** for request validation
- **Multer** for multipart file upload handling
- **Cloudinary** for file storage (resumes, images)
- **JWT** for authentication

### AI & Background Processing
- **Google Gemini** (structured JSON output) for resume-to-job-description analysis
- **BullMQ** + **Redis** for queued, asynchronous recruiter-side bulk resume screening
- **pdf-parse** for extracting text from uploaded resume PDFs

## Project Structure

```
shortlist/
├── backend/
│   └── src/
│       ├── db/
│       │   └── schema/          # Drizzle table definitions
│       │       ├── users.ts
│       │       ├── companies.ts
│       │       ├── jobs.ts
│       │       ├── applications.ts
│       │       ├── analysis.ts
│       │       ├── savedJobs.ts
│       │       └── refreshTokens.ts
│       ├── middleware/
│       │   ├── authenticate.ts  # JWT verification
│       │   ├── authorize.ts     # Role-based access (candidate / recruiter)
│       │   ├── upload.ts        # Multer in-memory config
│       │   ├── validate.ts      # Zod request validation
│       │   └── errorHandler.ts  # Global error handler
│       ├── modules/
│       │   ├── auth/            # Register, login, refresh, logout
│       │   ├── company/         # Create/update/get company profile
│       │   ├── job/             # CRUD jobs, public job listing & detail
│       │   ├── application/     # Apply, list applicants, update status
│       │   ├── analysis/        # Trigger & fetch AI resume analysis
│       │   ├── candidate/       # Profile update, candidate job-match analysis
│       │   └── savedJob/        # Save / unsave / list saved jobs
│       ├── queue/
│       │   ├── analysis.queue.ts   # BullMQ queue definition
│       │   ├── analysys.worker.ts  # Worker: runs Gemini analysis, updates DB
│       │   └── connection.ts       # Redis/IORedis connection
│       └── utils/
│           ├── gemini.ts           # Gemini API prompt + response parsing
│           ├── uploadToCloudinary.ts
│           ├── pdf.ts              # PDF text extraction
│           ├── jwt.ts
│           ├── bcrypt.ts
│           ├── ApiResponse.ts
│           └── ApiError.ts
│
└── frontend/
    └── src/
        ├── components/ui/       # Shared components: Button, Card, Table, Badge, Modal, etc.
        ├── features/
        │   ├── auth/            # Login, Register pages + auth store
        │   ├── recruiter/       # Dashboard, company, jobs, applicants, candidate profile
        │   ├── candidate/       # Dashboard, browse jobs, job detail, applications, saved, profile
        │   └── public/          # Landing page
        ├── routes/              # AppRoutes, ProtectedRoute, GuestRoute
        ├── layouts/             # RecruiterLayout, CandidateLayout (with sidebars)
        └── lib/                 # axios instance, formatting helpers
```

---

## Database Schema

```
users           — id, name, email, password (hashed), role, profileImageUrl, resumeUrl, bio, isActive
companies       — id, recruiterId (→ users.id), name, logoUrl, about, website
jobs            — id, companyId (→ companies.id), title, description, requirements,
                  salaryMin, salaryMax, location, jobType, jobStatus, deadline
applications    — id, jobId (→ jobs.id), candidateId (→ users.id), resumeUrl, status, appliedAt
analyses        — id, applicationId (→ applications.id, unique), status, score, analysis (jsonb)
saved_jobs      — userId (→ users.id) + jobId (→ jobs.id) [composite PK]
refresh_tokens  — userId (→ users.id, unique), hashedToken, expiresAt
```
---

## Local Development Setup

### Prerequisites
- Node.js 18+
- A PostgreSQL database
- A Redis instance
- A Cloudinary account
- A Google AI Studio API key (Gemini)

### 1. Clone and install

```bash
git clone https://github.com/your-username/shortlist.git
cd shortlist

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure environment variables

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development

DATABASE_URL=postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require

ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

REDIS_URL=redis://default:PASSWORD@HOST:PORT

GEMINI_API_KEY=your_gemini_api_key
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Run database migrations

```bash
cd backend
npm run db:generate   # generates SQL from schema
npm run db:migrate    # applies migrations to the database
```

### 4. Start the servers

```bash
# Terminal 1 — Backend (with hot reload)
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

The backend runs on **http://localhost:5000** and the frontend on **http://localhost:5173**.

---
