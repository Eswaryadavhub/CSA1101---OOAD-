# Class Diagram Documentation

This document represents the object-oriented structure of the **SkillMatch AI** platform, defining key entities, attributes, and relationships.

```mermaid
classDiagram
    class User {
        +String id
        +String email
        +String passwordHash
        +String role
        +DateTime createdAt
    }

    class Student {
        +String id
        +String name
        +String phone
        +String location
        +String degree
        +String department
        +String university
        +Int graduationYear
        +String experienceLevel
        +String projects
        +String internshipExperience
        +String interests
        +String preferredRole
        +String preferredIndustry
        +String preferredLocation
        +String workType
    }

    class Skill {
        +String id
        +String name
        +String category
    }

    class StudentSkill {
        +String id
        +String studentId
        +String skillId
        +String proficiency
    }

    class Opportunity {
        +String id
        +String title
        +String organization
        +String description
        +String type
        +String location
        +String duration
        +String experienceLevel
        +String workType
        +DateTime postedDate
    }

    class OpportunitySkill {
        +String id
        +String opportunityId
        +String skillId
        +Boolean isRequired
    }

    class CareerPath {
        +String id
        +String title
        +String description
        +String averageSalary
        +String demandLevel
    }

    class CareerPathSkill {
        +String id
        +String careerPathId
        +String skillId
    }

    class LearningResource {
        +String id
        +String skillId
        +String title
        +String url
        +String type
        +String duration
        +String provider
    }

    class MatchResult {
        +String id
        +String studentId
        +String opportunityId
        +Int score
        +String detailsJson
    }

    class SavedOpportunity {
        +String id
        +String studentId
        +String opportunityId
      }

    class Application {
        +String id
        +String studentId
        +String opportunityId
        +String status
        +DateTime appliedDate
    }

    User "1" --> "0..1" Student : owns
    Student "1" *-- "*" StudentSkill : has
    Skill "1" -- "*" StudentSkill : maps
    Student "1" -- "*" SavedOpportunity : saves
    Opportunity "1" -- "*" SavedOpportunity : saved_by
    Student "1" -- "*" Application : applies
    Opportunity "1" -- "*" Application : applied_by
    Student "1" -- "*" MatchResult : matches
    Opportunity "1" -- "*" MatchResult : matched_with
    Opportunity "1" *-- "*" OpportunitySkill : requires
    Skill "1" -- "*" OpportunitySkill : defines
    CareerPath "1" *-- "*" CareerPathSkill : maps
    Skill "1" -- "*" CareerPathSkill : defines
    Skill "1" *-- "*" LearningResource : resolves_gaps
```

---

## Entity Relationship Details
1. **Student - User (1:1)**: Every student account is associated with a single security credential entity.
2. **Student - StudentSkill (1:N)**: A student possesses multiple skills in their profile.
3. **Skill - StudentSkill / OpportunitySkill (1:N)**: Master skills are referenced in student profiles and opportunity requirements.
4. **Student - MatchResult (1:N)**: Represents the cached matching percentage compatibility with opportunities.
5. **CareerPath - LearningResource (1:N via Skill)**: Gaps are mapped to learning resources linked to specific skills within career path requirements.
