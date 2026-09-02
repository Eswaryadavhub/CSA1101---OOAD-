# SkillMatch AI: AI-Based Skill-to-Opportunity Matching & Career Development System

SkillMatch AI is an OOAD (Object-Oriented Analysis and Design) capstone system that connects students to jobs, internships, research projects, and online courses. The system dynamically computes compatibility scores based on skill sets, education, experience, interests, and preferences, and generates targeted learning recommendations to patch skill gaps.

---

## Technical Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts
- **Backend**: Node.js, Express, TypeScript
- **Database**: SQLite (managed via Prisma ORM)
- **Authentication**: JWT (JSON Web Tokens) with bcryptjs password hashing

---

## Core Features
1. **Student Dashboard**: Real-time statistics (Profile completion, top matches, registered skills) and list of top compatibility matches.
2. **Career Profile**: Management of academic details, experience levels, description of projects, interests, and career preferences.
3. **Skills Inventory**: Add master skills, specify proficiencies (Beginner, Intermediate, Advanced, Expert), and track visual progress indicators.
4. **Opportunity Discovery**: Browse postings with filters (Internship, Job, Project, Course) and search tools.
5. **Matching Engine**: Core algorithm computing compatibility percentages using weighted values:
   - Skill Match (50%)
   - Education Compatibility (15%)
   - Experience Match (10%)
   - Interests Alignment (10%)
   - Career Preferences Match (15%)
6. **Skill Gap Analysis**: Compares student capabilities against opportunity requirements, flagging priority (High/Medium/Low priority).
7. **Personalized Learning Paths**: Curates course listings to directly resolve identified gaps.
8. **Admin Portal**: View system statistics (Popular Skills, Opportunity Types, Average Matches), audit student accounts, and manage opportunity listings (CRUD operations).

---

## Database Structure
Defined in `backend/prisma/schema.prisma`:
- **User**: User credentials and roles (STUDENT, ADMIN).
- **Student**: Academic, experience, projects, and career preferences details.
- **Skill**: Master list of skills across categories.
- **StudentSkill**: Relational mapping between Student and Skill with proficiency levels.
- **Opportunity**: Job, Internship, Project, or Course listings.
- **OpportunitySkill**: Relational mapping of required vs preferred skills for postings.
- **CareerPath**: Defined career tracks.
- **LearningResource**: Standard courses mapping to skills to resolve gaps.
- **MatchResult**: Cached match calculation records.
- **SavedOpportunity**: Student bookmarks.
- **Application**: Student opportunity application records.

---

## API Documentation

### Authentication
- `POST /api/auth/login` - Authenticate user credentials and return JWT.

### Student Profile
- `GET /api/profile` - Fetch logged-in student profile.
- `PUT /api/profile` - Update student profile fields.

### Skills
- `GET /api/skills` - Fetch student's skills and all master skills.
- `POST /api/skills` - Add or update a student skill proficiency.
- `DELETE /api/skills/skill/:skillId` - Delete a skill from student profile.

### Opportunities & Matching
- `GET /api/opportunities` - Get listings with dynamic match scores and filtering.
- `GET /api/opportunities/:id` - Fetch opportunity details, match explanations, and skill gaps.
- `GET /api/matches` - Get ranked matching results list.
- `GET /api/skill-gaps` - Retrieve aggregated student skill gaps.
- `GET /api/saved-opportunities` - Fetch student saved bookmarks.
- `POST /api/saved-opportunities` - Save bookmark.
- `DELETE /api/saved-opportunities/:opportunityId` - Delete bookmark.
- `POST /api/applications` - Submit opportunity application.
- `GET /api/applications` - Fetch student applications.
- `GET /api/career-paths` - Fetch career tracks with compatibility matches.
- `GET /api/learning-path` - Fetch personalized learning recommendations.

### Administration
- `GET /api/admin/statistics` - Fetch analytics summaries and chart data.
- `GET /api/admin/students` - Audit student accounts list.
- `POST /api/admin/opportunities` - Publish a new opportunity.
- `PUT /api/admin/opportunities/:id` - Modify an existing opportunity.
- `DELETE /api/admin/opportunities/:id` - Remove an opportunity posting.

---

## Demo Credentials
- **Student Role**:
  - Email: `student@skillmatch.com`
  - Password: `student123`
- **Admin Role**:
  - Email: `admin@skillmatch.com`
  - Password: `admin123`

---

## Setup & Running Locally

### Prerequisites
- Node.js (v18+)
- npm

### 1. Installation
Run the installation command from the root workspace folder:
```bash
npm run install-all
```

### 2. Database Sync & Seeding
Set up the SQLite database file and seed standard lists:
```bash
# Push schema and generate Prisma Client
npm run prisma:db

# Seed databases
npm run prisma:seed
```

### 3. Run Dev Server
Start both backend API server and Vite frontend dev server:
```bash
npm run dev
```
- **Frontend URL**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

---

## Testing Instructions
1. Navigate to the frontend page (`http://localhost:5173`).
2. Log in as a Student (`student@skillmatch.com` / `student123`).
3. Check the student dashboard. Go to **My Profile** and update fields.
4. Go to **My Skills** and add/remove skills or change proficiencies.
5. Go to **Opportunities** or **Match Results** and check how matching scores are computed dynamically.
6. Click **View Details** on an opportunity card to review detailed **Skill Gap Analysis** (Matched vs Missing skills with priority).
7. Inspect the **Career Paths** recommendations and check the **Learning Plan** to see tailored resource paths.
8. Bookmark/Save opportunities and review them in **Saved Items**.
9. Logout and log in as an Admin (`admin@skillmatch.com` / `admin123`).
10. Review charts on the **Analytics Dashboard**, browse registered **Student Accounts**, and perform CRUD operations on **Manage Opportunities** (Create/Edit/Delete).
