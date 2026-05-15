# JobFlow AI // Pro Resume Workspace

> **Transform your professional identity with AI-driven craftsmanship.**

JobFlow AI is a premium, high-fidelity resume optimization and outreach platform designed for modern professionals. It combines sophisticated design aesthetics with powerful AI analysis to bridge the gap between talented candidates and their dream roles.

## 🚀 Key Features

- **Pro Resume Builder**: 
    - **Dual Flow**: Switch seamlessly between **AI-Powered Uploads** and **Manual Precision Building**.
    - **Multi-Step Core**: Structured entry for Personal, Professional, and Academic data.
    - **Live Premium Templates**: Choose from **Modern**, **Minimalist**, or **Creative** themes with real-time rendering.
    - **High-Fidelity PDF Export**: Document-ready PDFs generated with specialized print media queries.
- **AI Workspace**: 
    - **ATS Fit Score**: Real-time compatibility analysis against target job descriptions.
    - **Keyword Intelligence**: Identify missing technical and soft skills critical for ATS passage.
    - **Actionable Insights**: AI-generated suggestions to transform weak phrases into high-impact bullet points.
- **Outreach Hub**: (Coming Soon) Reach out to recruiters with AI-tailored messaging.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS (Luminescent Noir / Zen-Professional design system)
- **Animations**: Framer Motion (Optimized transitions and interactions)
- **Components**: Radix UI / Shadcn UI (Tabs, Input, Textarea, Badge)
- **Icons**: Lucide React

## 🎨 Design Philosophy: "Zen-Professional"

JobFlow AI utilizes a unique "Luminescent Noir" aesthetic—combining a dark-mode core with subtle glassmorphism and premium gradients. Every interaction is designed to feel intentional, smooth, and professional, reducing the stress of the job search.

## 📦 Getting Started

1. **Clone the repo**: `git clone https://github.com/shahrozimran/JobFlow-AI.git`
2. **Install dependencies**: `npm install`
3. **Copy env**: `cp .env.example .env.local` and fill in Supabase + OpenAI + scraper values
4. **Run development server**: `npm run dev`
5. **Build for production**: `npm run build`

## 🔎 Scraper Microservice (Plan A)

Job discovery is powered by a separate Python FastAPI worker under `./scraper-service`. It searches the live web, classifies results with an LLM, extracts structured job data (including hiring emails, posting/closing dates, salary), and writes verified rows into Supabase.

### Run the scraper locally

```bash
cp scraper-service/.env.example scraper-service/.env
# fill in OPENAI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SCRAPER_INTERNAL_TOKEN
docker compose up --build scraper
```

The service exposes:

- `GET  /healthz`
- `POST /scrape/run` (internal, requires `X-Internal-Token`)
- `GET  /scrape/run/{run_id}/stream` (SSE, internal)

Next.js talks to it through `/api/jobs/discover` and `/api/jobs/discover/[run_id]` using the shared `SCRAPER_INTERNAL_TOKEN`.

### Required Supabase migrations

Run in order from `supabase/migrations/`:

- `20260516000000_drop_outreach.sql` — removes the legacy outreach table
- `20260516000001_job_listings_scraper_mvp.sql` — adds source/confidence/lifecycle columns + `job_discovery_runs`

---
*JobFlow AI — Crafting Careers, One Pixel at a Time.*
