import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { MatchingEngine, StudentProfileData, OpportunityData, PROFICIENCY_MULTIPLIERS } from './services/MatchingEngine';

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'skillmatch_jwt_secret_key';

app.use(cors());
app.use(express.json());

// Extend express Request to include user details
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    studentId?: string;
  };
}

// Authentication Middleware
const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
    
    let studentId: string | undefined = undefined;
    if (decoded.role === 'STUDENT') {
      const student = await prisma.student.findUnique({
        where: { userId: decoded.id }
      });
      if (student) {
        studentId = student.id;
      }
    }

    req.user = {
      ...decoded,
      studentId
    };
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

// Admin Auth Middleware
const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(430).json({ message: 'Access denied. Admin role required.' });
  }
  next();
};

// Helper: Get student profile data in the format needed by MatchingEngine
async function getStudentProfileData(studentId: string): Promise<StudentProfileData | null> {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      skills: {
        include: {
          skill: true
        }
      }
    }
  });

  if (!student) return null;

  return {
    degree: student.degree,
    department: student.department,
    experienceLevel: student.experienceLevel,
    interests: student.interests,
    preferredRole: student.preferredRole,
    preferredIndustry: student.preferredIndustry,
    preferredLocation: student.preferredLocation,
    workType: student.workType,
    skills: student.skills.map(ss => ({
      name: ss.skill.name,
      category: ss.skill.category,
      proficiency: ss.proficiency
    }))
  };
}

// ----------------------------------------------------
// AUTHENTICATION ENDPOINTS
// ----------------------------------------------------

app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { student: true }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.student?.name || 'Administrator'
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error during login.' });
  }
});

// ----------------------------------------------------
// STUDENT PROFILE ENDPOINTS
// ----------------------------------------------------

app.get('/api/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || req.user.role !== 'STUDENT' || !req.user.studentId) {
    return res.status(400).json({ message: 'Student profile access only.' });
  }

  try {
    const student = await prisma.student.findUnique({
      where: { id: req.user.studentId },
      include: {
        user: { select: { email: true } }
      }
    });

    if (!student) {
      return res.status(404).json({ message: 'Profile not found.' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving profile.' });
  }
});

app.put('/api/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || req.user.role !== 'STUDENT' || !req.user.studentId) {
    return res.status(400).json({ message: 'Student profile update only.' });
  }

  const {
    name, phone, location, degree, department, university,
    graduationYear, experienceLevel, projects, internshipExperience,
    interests, preferredRole, preferredIndustry, preferredLocation, workType
  } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required.' });
  }

  try {
    const updated = await prisma.student.update({
      where: { id: req.user.studentId },
      data: {
        name,
        phone,
        location,
        degree,
        department,
        university,
        graduationYear: graduationYear ? parseInt(graduationYear, 10) : null,
        experienceLevel,
        projects,
        internshipExperience,
        interests,
        preferredRole,
        preferredIndustry,
        preferredLocation,
        workType
      }
    });

    res.json({ message: 'Profile updated successfully.', profile: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile.' });
  }
});

// ----------------------------------------------------
// SKILLS ENDPOINTS
// ----------------------------------------------------

app.get('/api/skills', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const masterSkills = await prisma.skill.findMany({
      orderBy: { name: 'asc' }
    });

    let studentSkills: any[] = [];
    if (req.user?.role === 'STUDENT' && req.user.studentId) {
      studentSkills = await prisma.studentSkill.findMany({
        where: { studentId: req.user.studentId },
        include: { skill: true }
      });
    }

    res.json({
      masterSkills,
      studentSkills: studentSkills.map(ss => ({
        id: ss.id,
        skillId: ss.skillId,
        name: ss.skill.name,
        category: ss.skill.category,
        proficiency: ss.proficiency
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching skills.' });
  }
});

app.post('/api/skills', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || req.user.role !== 'STUDENT' || !req.user.studentId) {
    return res.status(400).json({ message: 'Student access only.' });
  }

  const { skillId, skillName, category, proficiency } = req.body;

  if (!proficiency) {
    return res.status(400).json({ message: 'Proficiency is required.' });
  }

  try {
    let finalSkillId = skillId;

    // If only name and category are provided, create the skill if it doesn't exist
    if (!finalSkillId && skillName) {
      let existingSkill = await prisma.skill.findFirst({
        where: { name: { equals: skillName } }
      });

      if (!existingSkill) {
        existingSkill = await prisma.skill.create({
          data: {
            name: skillName,
            category: category || 'Tools'
          }
        });
      }
      finalSkillId = existingSkill.id;
    }

    if (!finalSkillId) {
      return res.status(400).json({ message: 'Skill identification is required.' });
    }

    // Create or update StudentSkill
    const studentSkill = await prisma.studentSkill.upsert({
      where: {
        studentId_skillId: {
          studentId: req.user.studentId,
          skillId: finalSkillId
        }
      },
      update: { proficiency },
      create: {
        studentId: req.user.studentId,
        skillId: finalSkillId,
        proficiency
      },
      include: { skill: true }
    });

    res.json({
      message: 'Skill added/updated successfully.',
      skill: {
        id: studentSkill.id,
        skillId: studentSkill.skillId,
        name: studentSkill.skill.name,
        category: studentSkill.skill.category,
        proficiency: studentSkill.proficiency
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving skill.' });
  }
});

app.delete('/api/skills/skill/:skillId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || req.user.role !== 'STUDENT' || !req.user.studentId) {
    return res.status(400).json({ message: 'Student access only.' });
  }

  const { skillId } = req.params;

  try {
    await prisma.studentSkill.delete({
      where: {
        studentId_skillId: {
          studentId: req.user.studentId,
          skillId
        }
      }
    });
    res.json({ message: 'Skill removed successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing skill.' });
  }
});

// ----------------------------------------------------
// OPPORTUNITIES & MATCHING ENDPOINTS
// ----------------------------------------------------

app.get('/api/opportunities', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { type, search, skill } = req.query;

  try {
    // Build query conditions
    const where: any = {};
    if (type) {
      where.type = type as string;
    }
    if (search) {
      where.OR = [
        { title: { contains: search as string } },
        { organization: { contains: search as string } },
        { description: { contains: search as string } }
      ];
    }
    if (skill) {
      where.skills = {
        some: {
          skill: { name: { contains: skill as string } }
        }
      };
    }

    const opportunities = await prisma.opportunity.findMany({
      where,
      include: {
        skills: {
          include: { skill: true }
        }
      },
      orderBy: { postedDate: 'desc' }
    });

    // If student, compute match scores
    if (req.user?.role === 'STUDENT' && req.user.studentId) {
      const studentProfile = await getStudentProfileData(req.user.studentId);
      if (studentProfile) {
        const mappedOpps = opportunities.map(opp => {
          const oppData: OpportunityData = {
            id: opp.id,
            title: opp.title,
            organization: opp.organization,
            description: opp.description,
            type: opp.type,
            location: opp.location,
            duration: opp.duration,
            experienceLevel: opp.experienceLevel,
            workType: opp.workType,
            skills: opp.skills.map(os => ({
              name: os.skill.name,
              category: os.skill.category,
              isRequired: os.isRequired
            }))
          };

          const matchDetails = MatchingEngine.calculateMatch(studentProfile, oppData);

          return {
            ...opp,
            matchScore: matchDetails.score,
            matchDetails
          };
        });

        // Default sort by match percentage descending
        mappedOpps.sort((a, b) => b.matchScore - a.matchScore);
        return res.json(mappedOpps);
      }
    }

    // Default return without match scores (e.g. for Admin or incomplete profiles)
    res.json(opportunities.map(opp => ({ ...opp, matchScore: 0 })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving opportunities.' });
  }
});

app.get('/api/opportunities/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  try {
    const opp = await prisma.opportunity.findUnique({
      where: { id },
      include: {
        skills: {
          include: { skill: true }
        }
      }
    });

    if (!opp) {
      return res.status(404).json({ message: 'Opportunity not found.' });
    }

    let matchDetails: any = null;
    let isSaved = false;
    let hasApplied = false;

    if (req.user?.role === 'STUDENT' && req.user.studentId) {
      const studentProfile = await getStudentProfileData(req.user.studentId);
      if (studentProfile) {
        const oppData: OpportunityData = {
          id: opp.id,
          title: opp.title,
          organization: opp.organization,
          description: opp.description,
          type: opp.type,
          location: opp.location,
          duration: opp.duration,
          experienceLevel: opp.experienceLevel,
          workType: opp.workType,
          skills: opp.skills.map(os => ({
            name: os.skill.name,
            category: os.skill.category,
            isRequired: os.isRequired
          }))
        };

        matchDetails = MatchingEngine.calculateMatch(studentProfile, oppData);

        // Update match result in db for persistent cache / statistics
        await prisma.matchResult.upsert({
          where: {
            studentId_opportunityId: {
              studentId: req.user.studentId,
              opportunityId: opp.id
            }
          },
          update: {
            score: matchDetails.score,
            detailsJson: JSON.stringify(matchDetails)
          },
          create: {
            studentId: req.user.studentId,
            opportunityId: opp.id,
            score: matchDetails.score,
            detailsJson: JSON.stringify(matchDetails)
          }
        });
      }

      // Check if saved
      const saved = await prisma.savedOpportunity.findFirst({
        where: { studentId: req.user.studentId, opportunityId: opp.id }
      });
      isSaved = !!saved;

      // Check if applied
      const applied = await prisma.application.findFirst({
        where: { studentId: req.user.studentId, opportunityId: opp.id }
      });
      hasApplied = !!applied;
    }

    res.json({
      ...opp,
      matchDetails,
      isSaved,
      hasApplied
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving opportunity details.' });
  }
});

// ----------------------------------------------------
// SAVED OPPORTUNITIES ENDPOINTS
// ----------------------------------------------------

app.get('/api/saved-opportunities', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || req.user.role !== 'STUDENT' || !req.user.studentId) {
    return res.status(400).json({ message: 'Student access only.' });
  }

  try {
    const saved = await prisma.savedOpportunity.findMany({
      where: { studentId: req.user.studentId },
      include: {
        opportunity: {
          include: {
            skills: {
              include: { skill: true }
            }
          }
        }
      }
    });

    const studentProfile = await getStudentProfileData(req.user.studentId);

    const result = saved.map(s => {
      const opp = s.opportunity;
      let score = 0;
      if (studentProfile) {
        const match = MatchingEngine.calculateMatch(studentProfile, {
          id: opp.id,
          title: opp.title,
          organization: opp.organization,
          description: opp.description,
          type: opp.type,
          location: opp.location,
          duration: opp.duration,
          experienceLevel: opp.experienceLevel,
          workType: opp.workType,
          skills: opp.skills.map(os => ({
            name: os.skill.name,
            category: os.skill.category,
            isRequired: os.isRequired
          }))
        });
        score = match.score;
      }
      return {
        id: s.id,
        opportunityId: opp.id,
        title: opp.title,
        organization: opp.organization,
        type: opp.type,
        location: opp.location,
        duration: opp.duration,
        matchScore: score,
        skills: opp.skills.map(os => os.skill.name)
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving saved opportunities.' });
  }
});

app.post('/api/saved-opportunities', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || req.user.role !== 'STUDENT' || !req.user.studentId) {
    return res.status(400).json({ message: 'Student access only.' });
  }

  const { opportunityId } = req.body;

  if (!opportunityId) {
    return res.status(400).json({ message: 'Opportunity ID is required.' });
  }

  try {
    await prisma.savedOpportunity.upsert({
      where: {
        studentId_opportunityId: {
          studentId: req.user.studentId,
          opportunityId
        }
      },
      update: {},
      create: {
        studentId: req.user.studentId,
        opportunityId
      }
    });

    res.json({ message: 'Opportunity saved successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving opportunity.' });
  }
});

app.delete('/api/saved-opportunities/:opportunityId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || req.user.role !== 'STUDENT' || !req.user.studentId) {
    return res.status(400).json({ message: 'Student access only.' });
  }

  const { opportunityId } = req.params;

  try {
    await prisma.savedOpportunity.delete({
      where: {
        studentId_opportunityId: {
          studentId: req.user.studentId,
          opportunityId
        }
      }
    });
    res.json({ message: 'Opportunity unsaved successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error unsaving opportunity.' });
  }
});

// ----------------------------------------------------
// APPLICATIONS ENDPOINTS
// ----------------------------------------------------

app.post('/api/applications', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || req.user.role !== 'STUDENT' || !req.user.studentId) {
    return res.status(400).json({ message: 'Student access only.' });
  }

  const { opportunityId } = req.body;

  if (!opportunityId) {
    return res.status(400).json({ message: 'Opportunity ID is required.' });
  }

  try {
    const app = await prisma.application.create({
      data: {
        studentId: req.user.studentId,
        opportunityId,
        status: 'Applied'
      }
    });
    res.json({ message: 'Application submitted successfully.', application: app });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting application.' });
  }
});

app.get('/api/applications', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || req.user.role !== 'STUDENT' || !req.user.studentId) {
    return res.status(400).json({ message: 'Student access only.' });
  }

  try {
    const apps = await prisma.application.findMany({
      where: { studentId: req.user.studentId },
      include: { opportunity: true }
    });
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications.' });
  }
});

// ----------------------------------------------------
// MATCHES, SKILL GAPS, CAREER PATHS & LEARNING PLAN
// ----------------------------------------------------

app.get('/api/matches', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || req.user.role !== 'STUDENT' || !req.user.studentId) {
    return res.status(400).json({ message: 'Student access only.' });
  }

  try {
    const studentProfile = await getStudentProfileData(req.user.studentId);
    if (!studentProfile) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    const opportunities = await prisma.opportunity.findMany({
      include: {
        skills: {
          include: { skill: true }
        }
      }
    });

    const matches = opportunities.map(opp => {
      const oppData: OpportunityData = {
        id: opp.id,
        title: opp.title,
        organization: opp.organization,
        description: opp.description,
        type: opp.type,
        location: opp.location,
        duration: opp.duration,
        experienceLevel: opp.experienceLevel,
        workType: opp.workType,
        skills: opp.skills.map(os => ({
          name: os.skill.name,
          category: os.skill.category,
          isRequired: os.isRequired
        }))
      };

      const match = MatchingEngine.calculateMatch(studentProfile, oppData);

      return {
        opportunityId: opp.id,
        title: opp.title,
        organization: opp.organization,
        type: opp.type,
        location: opp.location,
        duration: opp.duration,
        score: match.score,
        breakdown: match.breakdown,
        matchedSkills: match.matchedSkills,
        missingSkills: match.missingSkills,
        explanations: match.explanations
      };
    });

    matches.sort((a, b) => b.score - a.score);
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving match list.' });
  }
});

app.get('/api/skill-gaps', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || req.user.role !== 'STUDENT' || !req.user.studentId) {
    return res.status(400).json({ message: 'Student access only.' });
  }

  try {
    const studentProfile = await getStudentProfileData(req.user.studentId);
    if (!studentProfile) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    const opportunities = await prisma.opportunity.findMany({
      include: {
        skills: { include: { skill: true } }
      }
    });

    // Analyze gaps across opportunities with score >= 60%
    const gaps: Record<string, { skill: any; priority: 'High' | 'Medium'; count: number; opps: string[] }> = {};

    opportunities.forEach(opp => {
      const oppData: OpportunityData = {
        id: opp.id,
        title: opp.title,
        organization: opp.organization,
        description: opp.description,
        type: opp.type,
        location: opp.location,
        duration: opp.duration,
        experienceLevel: opp.experienceLevel,
        workType: opp.workType,
        skills: opp.skills.map(os => ({
          name: os.skill.name,
          category: os.skill.category,
          isRequired: os.isRequired
        }))
      };

      const match = MatchingEngine.calculateMatch(studentProfile, oppData);
      
      if (match.score >= 50) {
        match.missingSkills.forEach(missing => {
          if (!gaps[missing.name]) {
            const os = opp.skills.find(s => s.skill.name === missing.name);
            gaps[missing.name] = {
              skill: os?.skill || { name: missing.name, category: 'Technical' },
              priority: missing.priority === 'High' ? 'High' : 'Medium',
              count: 0,
              opps: []
            };
          }
          gaps[missing.name].count++;
          gaps[missing.name].opps.push(`${opp.title} (${opp.organization})`);
        });
      }
    });

    const gapList = Object.values(gaps).sort((a, b) => b.count - a.count);
    res.json(gapList);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving skill gap analysis.' });
  }
});

app.get('/api/career-paths', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || req.user.role !== 'STUDENT' || !req.user.studentId) {
    return res.status(400).json({ message: 'Student access only.' });
  }

  try {
    const studentProfile = await getStudentProfileData(req.user.studentId);
    if (!studentProfile) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    const careerPaths = await prisma.careerPath.findMany({
      include: {
        skills: {
          include: { skill: true }
        }
      }
    });

    const result = await Promise.all(careerPaths.map(async (cp) => {
      const cpSkills = cp.skills.map(cps => cps.skill);
      const studentSkillMap = new Map(studentProfile.skills.map(s => [s.name.toLowerCase(), s.proficiency]));

      let matchCount = 0;
      let sumProficiency = 0;
      const strongSkills: string[] = [];
      const toImprove: string[] = [];

      cpSkills.forEach(skill => {
        const prof = studentSkillMap.get(skill.name.toLowerCase());
        if (prof) {
          matchCount++;
          strongSkills.push(skill.name);
          sumProficiency += PROFICIENCY_MULTIPLIERS[prof] || 0.5;
        } else {
          toImprove.push(skill.name);
        }
      });

      // Calculate compatibility percentage
      const totalSkillsCount = cpSkills.length;
      let matchScore = 0;
      if (totalSkillsCount > 0) {
        const possessedFraction = matchCount / totalSkillsCount;
        const avgProf = matchCount > 0 ? sumProficiency / matchCount : 0;
        matchScore = Math.round((possessedFraction * 0.7 + avgProf * 0.3) * 100);
      } else {
        matchScore = 100;
      }

      // Fetch recommended learning resources for missing skills
      const resources = await prisma.learningResource.findMany({
        where: {
          skill: {
            name: { in: toImprove }
          }
        },
        include: { skill: true }
      });

      return {
        id: cp.id,
        title: cp.title,
        description: cp.description,
        averageSalary: cp.averageSalary,
        demandLevel: cp.demandLevel,
        matchScore,
        strongSkills,
        toImprove,
        learningPath: resources.map(r => ({
          skill: r.skill.name,
          title: r.title,
          url: r.url,
          type: r.type,
          duration: r.duration,
          provider: r.provider,
          priority: toImprove.slice(0, 2).includes(r.skill.name) ? 'High' : 'Medium'
        }))
      };
    }));

    result.sort((a, b) => b.matchScore - a.matchScore);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving career path recommendations.' });
  }
});

app.get('/api/learning-path', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || req.user.role !== 'STUDENT' || !req.user.studentId) {
    return res.status(400).json({ message: 'Student access only.' });
  }

  try {
    const studentProfile = await getStudentProfileData(req.user.studentId);
    if (!studentProfile) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    // Collect all missing required skills across opportunities
    const opportunities = await prisma.opportunity.findMany({
      include: {
        skills: { include: { skill: true } }
      }
    });

    const missingSkillNames = new Set<string>();
    opportunities.forEach(opp => {
      const oppData: OpportunityData = {
        id: opp.id,
        title: opp.title,
        organization: opp.organization,
        description: opp.description,
        type: opp.type,
        location: opp.location,
        duration: opp.duration,
        experienceLevel: opp.experienceLevel,
        workType: opp.workType,
        skills: opp.skills.map(os => ({
          name: os.skill.name,
          category: os.skill.category,
          isRequired: os.isRequired
        }))
      };

      const match = MatchingEngine.calculateMatch(studentProfile, oppData);
      if (match.score >= 50) {
        match.missingSkills.forEach(m => {
          missingSkillNames.add(m.name);
        });
      }
    });

    // If no missing skills found (e.g. perfect matches), check missing skills from top career recommendation
    if (missingSkillNames.size === 0) {
      const careerPaths = await prisma.careerPath.findMany({
        include: { skills: { include: { skill: true } } }
      });
      // Pick first
      if (careerPaths.length > 0) {
        const studentSkillNames = new Set(studentProfile.skills.map(s => s.name.toLowerCase()));
        careerPaths[0].skills.forEach(cps => {
          if (!studentSkillNames.has(cps.skill.name.toLowerCase())) {
            missingSkillNames.add(cps.skill.name);
          }
        });
      }
    }

    const resources = await prisma.learningResource.findMany({
      where: {
        skill: {
          name: { in: Array.from(missingSkillNames) }
        }
      },
      include: { skill: true }
    });

    const learningPath = resources.map((r, index) => ({
      id: r.id,
      skill: r.skill.name,
      priority: index < 3 ? 'High' : 'Medium',
      duration: r.duration,
      resourceType: r.type,
      title: r.title,
      url: r.url,
      provider: r.provider,
      completionStatus: 'Not Started'
    }));

    res.json(learningPath);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving learning path.' });
  }
});

// ----------------------------------------------------
// ADMIN DASHBOARD & CRUD ENDPOINTS
// ----------------------------------------------------

app.get('/api/admin/statistics', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const totalStudents = await prisma.student.count();
    const totalOpportunities = await prisma.opportunity.count();
    const totalSkills = await prisma.skill.count();

    // Aggregates for graphs
    // 1. Opportunity types distribution
    const opps = await prisma.opportunity.findMany({ select: { type: true } });
    const oppTypeCounts: Record<string, number> = { Internship: 0, Job: 0, Project: 0, Course: 0 };
    opps.forEach(o => {
      if (oppTypeCounts[o.type] !== undefined) {
        oppTypeCounts[o.type]++;
      } else {
        oppTypeCounts[o.type] = 1;
      }
    });
    const opportunityTypes = Object.entries(oppTypeCounts).map(([name, value]) => ({ name, value }));

    // 2. Average Match Score
    const matchResults = await prisma.matchResult.findMany({ select: { score: true } });
    const avgMatchScore = matchResults.length > 0
      ? Math.round(matchResults.reduce((sum, r) => sum + r.score, 0) / matchResults.length)
      : 76; // Default seed benchmark

    // 3. Popular Skills Added
    const studentSkills = await prisma.studentSkill.findMany({
      include: { skill: true }
    });
    const skillCounts: Record<string, number> = {};
    studentSkills.forEach(ss => {
      skillCounts[ss.skill.name] = (skillCounts[ss.skill.name] || 0) + 1;
    });
    const popularSkills = Object.entries(skillCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // 4. Career paths recommendation stats
    // Let's count how many students would match well (>70%) with each career path
    const students = await prisma.student.findMany({
      include: { skills: { include: { skill: true } } }
    });
    const careerPaths = await prisma.careerPath.findMany({
      include: { skills: { include: { skill: true } } }
    });

    const careerPathRecommendations = careerPaths.map(cp => {
      let recommendCount = 0;
      const cpSkillNames = cp.skills.map(s => s.skill.name.toLowerCase());

      students.forEach(st => {
        const stSkillNames = st.skills.map(s => s.skill.name.toLowerCase());
        const intersection = cpSkillNames.filter(name => stSkillNames.includes(name));
        const matchRatio = cpSkillNames.length > 0 ? intersection.length / cpSkillNames.length : 1;
        if (matchRatio >= 0.5) {
          recommendCount++;
        }
      });

      return {
        name: cp.title,
        students: recommendCount
      };
    }).sort((a, b) => b.students - a.students).slice(0, 5);

    res.json({
      summary: {
        totalStudents,
        totalOpportunities,
        totalSkills,
        totalMatches: matchResults.length || totalStudents * 4 // Fallback
      },
      charts: {
        opportunityTypes,
        popularSkills,
        averageMatchScore: avgMatchScore,
        careerPathRecommendations
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving statistics.' });
  }
});

// Admin Students list
app.get('/api/admin/students', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const students = await prisma.student.findMany({
      include: {
        user: { select: { email: true } },
        skills: { include: { skill: true } }
      }
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving student accounts.' });
  }
});

// Admin Opportunity CRUD
app.post('/api/admin/opportunities', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  const { title, organization, description, type, location, duration, experienceLevel, workType, requiredSkills, preferredSkills } = req.body;

  if (!title || !organization || !type || !location || !experienceLevel || !workType) {
    return res.status(400).json({ message: 'Required fields are missing.' });
  }

  try {
    const opportunity = await prisma.opportunity.create({
      data: {
        title,
        organization,
        description: description || '',
        type,
        location,
        duration: duration || 'Flexible',
        experienceLevel,
        workType
      }
    });

    // Map required skills
    if (requiredSkills && Array.isArray(requiredSkills)) {
      for (const skillName of requiredSkills) {
        let skill = await prisma.skill.findUnique({ where: { name: skillName } });
        if (!skill) {
          skill = await prisma.skill.create({ data: { name: skillName, category: 'Programming' } });
        }
        await prisma.opportunitySkill.create({
          data: {
            opportunityId: opportunity.id,
            skillId: skill.id,
            isRequired: true
          }
        });
      }
    }

    // Map preferred skills
    if (preferredSkills && Array.isArray(preferredSkills)) {
      for (const skillName of preferredSkills) {
        let skill = await prisma.skill.findUnique({ where: { name: skillName } });
        if (!skill) {
          skill = await prisma.skill.create({ data: { name: skillName, category: 'Programming' } });
        }
        await prisma.opportunitySkill.create({
          data: {
            opportunityId: opportunity.id,
            skillId: skill.id,
            isRequired: false
          }
        });
      }
    }

    // Trigger clear of existing MatchResult entries for recalculation on next load
    await prisma.matchResult.deleteMany({
      where: { opportunityId: opportunity.id }
    });

    res.json({ message: 'Opportunity created successfully.', opportunity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating opportunity.' });
  }
});

app.put('/api/admin/opportunities/:id', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { title, organization, description, type, location, duration, experienceLevel, workType, requiredSkills, preferredSkills } = req.body;

  try {
    const opp = await prisma.opportunity.findUnique({ where: { id } });
    if (!opp) {
      return res.status(404).json({ message: 'Opportunity not found.' });
    }

    await prisma.opportunity.update({
      where: { id },
      data: {
        title,
        organization,
        description,
        type,
        location,
        duration,
        experienceLevel,
        workType
      }
    });

    // Reset skills mapping
    await prisma.opportunitySkill.deleteMany({
      where: { opportunityId: id }
    });

    // Map required skills
    if (requiredSkills && Array.isArray(requiredSkills)) {
      for (const skillName of requiredSkills) {
        let skill = await prisma.skill.findUnique({ where: { name: skillName } });
        if (!skill) {
          skill = await prisma.skill.create({ data: { name: skillName, category: 'Programming' } });
        }
        await prisma.opportunitySkill.create({
          data: {
            opportunityId: id,
            skillId: skill.id,
            isRequired: true
          }
        });
      }
    }

    // Map preferred skills
    if (preferredSkills && Array.isArray(preferredSkills)) {
      for (const skillName of preferredSkills) {
        let skill = await prisma.skill.findUnique({ where: { name: skillName } });
        if (!skill) {
          skill = await prisma.skill.create({ data: { name: skillName, category: 'Programming' } });
        }
        await prisma.opportunitySkill.create({
          data: {
            opportunityId: id,
            skillId: skill.id,
            isRequired: false
          }
        });
      }
    }

    // Trigger clear of existing MatchResult entries
    await prisma.matchResult.deleteMany({
      where: { opportunityId: id }
    });

    res.json({ message: 'Opportunity updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating opportunity.' });
  }
});

app.delete('/api/admin/opportunities/:id', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.opportunity.delete({ where: { id } });
    res.json({ message: 'Opportunity deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting opportunity.' });
  }
});

// Start express server
app.listen(PORT, () => {
  console.log(`SkillMatch AI API Server listening on port ${PORT}`);
});
