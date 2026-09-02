# Architecture Documentation

This document describes the design layers and architecture patterns utilized in the **SkillMatch AI** platform.

## Architecture Patterns
We utilize a **Modular Monorepo Architecture** splitting responsibilities between:
1. **Frontend Presentation Layer**: Powered by React, Vite, Tailwind CSS, Lucide Icons, and Recharts. Communication is conducted via REST queries.
2. **Backend Services Layer**: Built with Express, TypeScript, and Prisma ORM.
3. **Storage Layer**: SQLite for zero-setup database storage.

---

## Component Layers

```
┌────────────────────────────────────────────────────────┐
│               React Frontend Application               │
│  (Landing, Dashboard, Profile, Skills, Opportunities,   │
│   Saved, Gaps, Matches, Career Paths, Learning Plan)   │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP JSON / REST API
                            ▼
┌────────────────────────────────────────────────────────┐
│                Express API Controller                  │
│       (Auth, Profile, Skills, Opportunities APIs)      │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│             MatchingEngine Algorithm Service           │
│      (Computes weights: Skills 50%, Career 15%,        │
│       Education 15%, Experience 10%, Interests 10%)    │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                 Prisma Data Access Layer               │
│               (Database query executions)              │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                  SQLite Local Database                 │
│                      (dev.db file)                     │
└────────────────────────────────────────────────────────┘
```

### 1. Presentation Layer
- **App.tsx**: Central router controlling sidebar menus, rendering sub-components, and managing active user sessions.
- **api.ts**: Unified client library executing `fetch()` calls. Uses JWT headers.
- **index.css**: Custom styling system establishing fonts and variables.

### 2. Business Logic Layer
- **MatchingEngine.ts**: Implements the score calculation weights:
  - Skill Score (50%)
  - Education (15%)
  - Experience (10%)
  - Interests (10%)
  - Career Preferences (15%)
  It also calculates prioritized skill gaps (High/Medium/Low priority missing skills) and why scores were achieved.

### 3. Data Layer
- **schema.prisma**: Declares entity relationships (Student to StudentSkill, Opportunity to OpportunitySkill, etc.) mapped directly to SQLite database.
