# Job and Outreach System Structure

Here is a comprehensive breakdown of the structures and flows we recently implemented for both the **Job Aggregation System** and the **Outreach System**.

---

## 1. Outreach System (`src/app/dashboard/outreach/page.tsx`)

**Purpose**: An "Outreach Hub" where users can generate, edit, and track personalized cold emails and networking messages.

**Data Model (Supabase Table: `outreach_logs`)**:
```typescript
interface OutreachLog {
  id: string;
  user_id: string;
  company: string;
  target_role: string;
  contact_email: string | null;
  subject: string;
  body: string;
  status: "draft" | "sent";
  created_at: string;
  sent_at: string | null;
}
```

**Key Workflows & Implementation**:
- **Cross-Feature Initialization**: On component mount, the page checks `sessionStorage` for `jobflow_outreach_context`. If it exists (usually placed there by the Resume Workspace), it automatically opens the modal, pre-fills the `targetRole` and `company`, and kicks off the AI email generation automatically.
- **AI Generation**: A request is sent to the backend route (`/api/outreach/generate`) passing the target company, role, job description, and the user's resume content. The AI returns a generated subject line, email body, and attempts to extract a contact email.
- **Draft Management**: The generated email is saved directly to Supabase as a `draft`. Users can click "Continue Draft" on the dashboard to reopen the modal, edit the subject/body, or manually input a contact email if the AI couldn't find one.
- **Native Gmail Integration**: Users click "Open in Gmail". The app constructs a `mail.google.com` URL prefilling the `to`, `su` (subject), and `body` fields, and opens it securely in a new tab.
- **Status Tracking**: Once sent via Gmail, the user manually clicks "Mark as Sent" in the app, which updates the `status` to `sent` and sets the `sent_at` timestamp.

---

## 2. Job Search & Extraction System (`src/app/dashboard/jobs/page.tsx`)

**Purpose**: A dual-tab system that allows users to either browse a cached, aggregated feed of jobs OR dynamically extract structured job data from any public URL (LinkedIn, Indeed, etc.) using AI.

**Data Models**:
```typescript
// 1. Cached Job Feed (from /api/jobs/search)
interface JobListing {
  id: string;          // Extracted internal DB ID
  source: string;      // E.g., 'remotive', 'himalayas', 'arbeitnow'
  title: string;
  company: string;
  description: string;
  tags: string[];
  // ... and other metadata (salary, employment_type, location, etc.)
}

// 2. AI Extracted Job (from /api/jobs/extract)
interface ExtractedJob {
  title: string;
  company: string;
  description: string;
  requirements: string[]; // AI destructured array of requirements
  applyUrl: string | null;
  // ... metadata
}
```

**Key Workflows & Implementation**:
- **Automatic Cache Refreshing**: On load, the page hits `/api/jobs/refresh`. If the cache is stale, the server fetches new jobs from third-party APIs (Remotive, Himalayas, etc.) and upserts them into the database.
- **Browse Flow (Tab 1)**: Queries the local Supabase cache via `/api/jobs/search?q={query}&page={page}`. Results are paginated. Users can select jobs to view a split-pane layout displaying full descriptions and metadata.
- **AI URL Importer (Tab 2)**: 
  - The user pastes a raw URL (e.g., a LinkedIn job posting).
  - The frontend hits `/api/jobs/extract`. 
  - The backend scrapes the URL, passes the raw HTML text to an LLM, and returns neatly structured `ExtractedJob` JSON data.
- **Resume Handoff integration**: Both tabs feature a **"Generate Resume"** button. Clicking this takes the active job's Title, Company, and Description, saves it to `sessionStorage` under `jobflow_selected_job`, and redirects the user to `/dashboard/resume-workspace?fromJob=true`. The Resume Workspace then automatically reads this session data to tailor the resume generation.

---

## 🚀 Where To Build Next
For the developer taking over, here are the easiest integration points for new features based on this structure:
1. **Outreach Email Reply Tracking**: The current implementation tracks `draft` -> `sent`. We can expand this status pipeline (e.g. `replied`, `interviewing`).
2. **Bulk Job Saving**: Add a `saved_jobs` table to allow users to bookmark jobs from the Browse tab before generating a resume.
3. **Automated Follow-ups**: Using the `sent_at` timestamp in the `OutreachLog`, you could create a cron job or dashboard alert to remind users to follow up on emails sent > 5 days ago.
