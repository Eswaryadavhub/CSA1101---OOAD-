# Use Case Documentation

This document describes the primary use cases and actors for the **SkillMatch AI** platform, highlighting system boundaries and key interactions.

## Actors
1. **Student**: A user seeking internships, projects, jobs, and learning opportunities. They manage their skills, preferences, and view compatibility analysis.
2. **Administrator**: A backend platform manager who manages the database of opportunities, views platform analytics, and reviews student profiles.

---

## Use Case Descriptions

```mermaid
usecaseDiagram
  actor Student
  actor Administrator

  Student --> (Manage Profile)
  Student --> (Manage Skills)
  Student --> (Explore Opportunities)
  Student --> (View Match Scores)
  Student --> (Inspect Skill Gaps)
  Student --> (Explore Career Paths)
  Student --> (Access Learning Recommendations)
  Student --> (Save & Apply to Opportunities)

  Administrator --> (View Analytics Dashboard)
  Administrator --> (Manage Opportunities CRUD)
  Administrator --> (Audit Student Accounts)
```

### 1. Student Use Cases

#### Use Case: Manage Profile
* **Description**: Allows the student to edit personal info, educational background, professional experience, projects, and interests.
* **Preconditions**: Student is authenticated.
* **Postconditions**: Profile state is saved in the SQLite database and used for matching calculations.

#### Use Case: Manage Skills
* **Description**: Student adds/removes programming, database, cloud, tools, and soft skills, and specifies proficiency levels.
* **Preconditions**: Student is authenticated.
* **Postconditions**: Profile skills list is updated. Match percentages are recomputed automatically.

#### Use Case: Explore Opportunities & Match Scores
* **Description**: Student views a filterable database of jobs, internships, projects, and courses. The system displays a dynamically calculated match score for each item.
* **Preconditions**: Student profile and skills are populated.
* **Postconditions**: The UI displays matched cards ranked by score.

#### Use Case: Inspect Skill Gaps & Apply
* **Description**: Student clicks an opportunity to see exactly which skills match and which are missing, prioritizing them by High, Medium, or Low priority. They can also submit an application.
* **Preconditions**: Student selects an opportunity.
* **Postconditions**: Display of gap analysis. Application is created in the database.

#### Use Case: Explore Career Paths & Learning Recommendations
* **Description**: Student reviews 8 major tech career paths to see their match scores, missing skills, and recommended learning resources.
* **Preconditions**: Student is authenticated.
* **Postconditions**: Recommended resources are shown. Statuses can be tracked as "In Progress" or "Completed".

---

### 2. Administrator Use Cases

#### Use Case: View Analytics Dashboard
* **Description**: Admin views platform statistics, including total student count, opportunity distribution, popular skills, average match scores, and recommended career paths.
* **Preconditions**: Admin is authenticated.

#### Use Case: Manage Opportunities (CRUD)
* **Description**: Admin creates, reads, updates, and deletes opportunities, mapping required/preferred skills.
* **Preconditions**: Admin is authenticated.
* **Postconditions**: Opportunity postings database is updated.
