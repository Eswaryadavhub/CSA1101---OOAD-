# Sequence Diagram Documentation

This document describes the runtime interactions between components during core system operations.

## 1. Authentication Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as Student / Admin
    participant UI as React Frontend
    participant Server as Express Backend
    participant DB as SQLite Database

    User->>UI: Input Email & Password
    UI->>Server: POST /api/auth/login
    Server->>DB: Find User by Email
    DB-->>Server: Return User Record & PasswordHash
    Server->>Server: Compare Passwords (bcryptjs)
    alt Passwords Match
        Server->>Server: Generate JWT Token
        Server-->>UI: Return Token & User Metadata
        UI->>UI: Save Token to LocalStorage
        UI-->>User: Grant Access & Render Dashboard
    else Invalid Credentials
        Server-->>UI: Return 401 Unauthorized
        UI-->>User: Display Error Banner
    end
```

---

## 2. Match Score Calculation & Gap Analysis Flow

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant UI as React Frontend
    participant Server as Express Backend
    participant Matcher as MatchingEngine Service
    participant DB as SQLite Database

    Student->>UI: Navigate to Opportunities
    UI->>Server: GET /api/opportunities
    Server->>DB: Fetch Student Profile & Skills
    DB-->>Server: Return ProfileData & StudentSkills
    Server->>DB: Fetch All Opportunity Postings & Skills
    DB-->>Server: Return Opportunities & ReqSkills
    
    loop For each Opportunity
        Server->>Matcher: calculateMatch(student, opportunity)
        Matcher->>Matcher: 1. Calculate weighted skill match (50%)
        Matcher->>Matcher: 2. Calculate education match (15%)
        Matcher->>Matcher: 3. Calculate experience match (10%)
        Matcher->>Matcher: 4. Calculate interests match (10%)
        Matcher->>Matcher: 5. Calculate career preferences (15%)
        Matcher-->>Server: Return MatchDetails (Score, Explanations, Gaps)
    end
    
    Server-->>UI: Return Ranked Opportunities with MatchScores
    UI-->>Student: Render ranked dashboard cards
```
