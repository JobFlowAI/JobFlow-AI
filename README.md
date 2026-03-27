# 🌌 JobFlow AI: The Zen-Professional Career Platform

> **Accelerate your career with AI-powered precision and a minimalist, focused interface.**

JobFlow AI is a high-end, premium job acquisition platform designed to streamline the modern job search. By combining cutting-edge AI parsing with a "Zen-Professional" aesthetic, it transforms the chaotic process of job hunting into a calm, data-driven journey.

---

## ✨ Core Functionalities & Features

### 🛠️ AI Resume Workspace
The heart of your application strategy. Upload your resume and let our models do the heavy lifting.
- **Intelligent Parsing**: Extracts data from PDF and DOCX formats with high accuracy.
- **Fit Score Analysis**: A dynamic gauge (0-100) that measures how well your profile matches specific job requirements.
- **Keyword Gap Analysis**: Identifies missing critical skills and highlights found keywords to pass ATS filters.
- **AI-Powered Suggestions**: Provides "Before & After" rewrites for your experience and skills sections.
- **Credit-Based System**: Efficient resource management (2 credits per parse).

### 🎯 Outreach Hub
Turn job matches into active conversations with one-click efficiency.
- **Smart Job Matching**: Curated list of high-fit roles from top-tier companies (Stripe, Vercel, Linear, etc.).
- **Data-Rich Cards**: View salary ranges, location, and posting date at a glance.
- **Personalized Outreach**: Generate and send tailored application emails in seconds.
- **Glass Email Preview**: Review and edit AI-crafted messages before sending (1 credit per outreach).

### 📊 Intelligent Dashboard
Your career command center.
- **Metric Tracking**: Monitor your credit balance, active applications, and interview conversion rates.
- **Progress Visualization**: Beautiful charts (via Recharts) providing insights into your job hunt trends.
- **Quick Actions**: Rapid access to the Resume Workspace and Outreach Hub.

### ✍️ Content & Education
- **JobFlow Blog**: A dedicated space for career advice, industry trends, and technical guides.
- **SEO Optimized**: Every article is crafted for maximum reach and readability.
- **Careers Page**: A professional "No Open Positions" state and dynamic job board for JobFlow's internal growth.

---

## 🛠️ The "Zen" Tech Stack

JobFlow AI is built with a focus on performance, type safety, and premium user experience.

| Category | Technologies |
| :--- | :--- |
| **Core** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, CSS Variables |
| **Components** | Radix UI (Shadcn/UI), Lucide Icons |
| **Animations** | Framer Motion |
| **Data Fetching** | TanStack Query (React Query) |
| **Forms & Validation** | React Hook Form, Zod |
| **Visualization** | Recharts |
| **Notifications** | Sonner (Toasts) |
| **Testing** | Vitest (Unit), Playwright (E2E) |
| **Package Manager**| Bun / NPM |

---

## 🏗️ Project Architecture

```text
JobFlow AI/
├── src/
│   ├── components/       # Reusable UI & Layout components
│   │   ├── landing/      # Hero, Pricing, Footer, etc.
│   │   ├── layout/       # Sidebar (AppSidebar), TopBar, DashboardLayout
│   │   └── ui/           # Atomic Shadcn/UI components
│   ├── pages/            # Page-level components & routes
│   │   ├── ResumeWorkspace.tsx
│   │   ├── Outreach.tsx
│   │   ├── Dashboard.tsx
│   │   └── Blog.tsx
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions (utils.ts)
│   ├── data/             # Mock data & constants
│   ├── App.tsx           # Route definitions & providers
│   └── main.tsx          # Application entry point
├── public/               # Static assets
└── tests/                # Testing suites
```

---

## 🚀 Getting Started

### Prerequisites
- [Bun](https://bun.sh/) (Recommended) or Node.js (v18+)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/jobflow-ai.git
   cd jobflow-ai
   ```
2. Install dependencies:
   ```bash
   bun install
   # or
   npm install
   ```

### Development
Start the development server:
```bash
bun dev
# or
npm run dev
```

### Build
Generate a production-ready bundle:
```bash
bun run build
# or
npm run build
```

---

## 🎨 Design Philosophy: "Zen-Professional"

JobFlow AI isn't just a tool; it's an experience.
- **Glassmorphism**: Subtle blurs and translucent layers for a modern, airy feel.
- **Luminescent Accents**: Carefully curated glow effects that guide user attention.
- **Micro-Animations**: Powered by Framer Motion to make every interaction feel fluid and responsive.
- **Focused UX**: A "distraction-free" layout that prioritizes your data without overwhelming the senses.

---

## 📄 License
Created by SHAHROZ. All rights reserved.
