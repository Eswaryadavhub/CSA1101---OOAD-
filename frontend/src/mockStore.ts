import { MatchingEngine } from './services/MatchingEngine';
import type { StudentProfileData, OpportunityData } from './services/MatchingEngine';
import { ResourceRecommendationEngine } from './services/ResourceRecommendationEngine';

// Master Skills
export const MASTER_SKILLS = [
  { id: 'sk1', name: 'Java', category: 'Programming' },
  { id: 'sk2', name: 'Python', category: 'Programming' },
  { id: 'sk3', name: 'JavaScript', category: 'Programming' },
  { id: 'sk4', name: 'TypeScript', category: 'Programming' },
  { id: 'sk5', name: 'C++', category: 'Programming' },
  { id: 'sk6', name: 'C#', category: 'Programming' },
  { id: 'sk7', name: 'SQL', category: 'Database' },
  { id: 'sk8', name: 'PostgreSQL', category: 'Database' },
  { id: 'sk9', name: 'MongoDB', category: 'Database' },
  { id: 'sk10', name: 'Redis', category: 'Database' },
  { id: 'sk11', name: 'React', category: 'Web Development' },
  { id: 'sk12', name: 'Node.js', category: 'Web Development' },
  { id: 'sk13', name: 'Express', category: 'Web Development' },
  { id: 'sk14', name: 'HTML', category: 'Web Development' },
  { id: 'sk15', name: 'CSS', category: 'Web Development' },
  { id: 'sk16', name: 'Angular', category: 'Web Development' },
  { id: 'sk17', name: 'AWS', category: 'Cloud' },
  { id: 'sk18', name: 'Docker', category: 'Cloud' },
  { id: 'sk19', name: 'Kubernetes', category: 'Cloud' },
  { id: 'sk20', name: 'Azure', category: 'Cloud' },
  { id: 'sk21', name: 'PyTorch', category: 'AI/ML' },
  { id: 'sk22', name: 'TensorFlow', category: 'AI/ML' },
  { id: 'sk23', name: 'Pandas', category: 'AI/ML' },
  { id: 'sk24', name: 'NumPy', category: 'AI/ML' },
  { id: 'sk25', name: 'Scikit-Learn', category: 'AI/ML' },
  { id: 'sk26', name: 'Communication', category: 'Soft Skills' },
  { id: 'sk27', name: 'Leadership', category: 'Soft Skills' },
  { id: 'sk28', name: 'Teamwork', category: 'Soft Skills' },
  { id: 'sk29', name: 'Problem Solving', category: 'Soft Skills' },
  { id: 'sk30', name: 'Git', category: 'Tools' },
  { id: 'sk31', name: 'Jira', category: 'Tools' },
  { id: 'sk32', name: 'Figma', category: 'Tools' },
  { id: 'sk33', name: 'Postman', category: 'Tools' },
];

// Initial Student Skills
const INITIAL_STUDENT_SKILLS = [
  { id: 'ss1', skillId: 'sk1', skill: { id: 'sk1', name: 'Java', category: 'Programming' }, proficiency: 'Intermediate' },
  { id: 'ss2', skillId: 'sk7', skill: { id: 'sk7', name: 'SQL', category: 'Database' }, proficiency: 'Intermediate' },
  { id: 'ss3', skillId: 'sk11', skill: { id: 'sk11', name: 'React', category: 'Web Development' }, proficiency: 'Beginner' },
  { id: 'ss4', skillId: 'sk14', skill: { id: 'sk14', name: 'HTML', category: 'Web Development' }, proficiency: 'Advanced' },
  { id: 'ss5', skillId: 'sk15', skill: { id: 'sk15', name: 'CSS', category: 'Web Development' }, proficiency: 'Intermediate' },
  { id: 'ss6', skillId: 'sk3', skill: { id: 'sk3', name: 'JavaScript', category: 'Programming' }, proficiency: 'Intermediate' },
  { id: 'ss7', skillId: 'sk30', skill: { id: 'sk30', name: 'Git', category: 'Tools' }, proficiency: 'Intermediate' },
  { id: 'ss8', skillId: 'sk26', skill: { id: 'sk26', name: 'Communication', category: 'Soft Skills' }, proficiency: 'Advanced' },
];

// Initial Opportunities
const INITIAL_OPPORTUNITIES = [
  {
    id: 'opp-1',
    title: 'Software Developer Intern',
    organization: 'TechNova Solutions',
    description: 'Join our software team to help build high-scale web platforms. You will work on creating REST API endpoints, designing backend logic, and collaborating with frontend teams.',
    type: 'Internship',
    location: 'San Francisco, CA',
    duration: '3 months',
    experienceLevel: 'Entry',
    workType: 'Remote',
    skills: [
      { id: 'os-1', isRequired: true, skill: { name: 'Java', category: 'Programming' } },
      { id: 'os-2', isRequired: true, skill: { name: 'SQL', category: 'Database' } },
      { id: 'os-3', isRequired: true, skill: { name: 'Git', category: 'Tools' } },
      { id: 'os-4', isRequired: false, skill: { name: 'React', category: 'Web Development' } },
      { id: 'os-5', isRequired: false, skill: { name: 'Express', category: 'Web Development' } },
    ],
  },
  {
    id: 'opp-2',
    title: 'Data Analyst Intern',
    organization: 'Insight Analytics',
    description: 'Looking for a data enthusiast to help parse big datasets, create internal dashboards, and write database queries to support product launch tracking.',
    type: 'Internship',
    location: 'New York, NY',
    duration: '6 months',
    experienceLevel: 'Entry',
    workType: 'Hybrid',
    skills: [
      { id: 'os-6', isRequired: true, skill: { name: 'Python', category: 'Programming' } },
      { id: 'os-7', isRequired: true, skill: { name: 'SQL', category: 'Database' } },
      { id: 'os-8', isRequired: true, skill: { name: 'Pandas', category: 'AI/ML' } },
      { id: 'os-9', isRequired: false, skill: { name: 'Communication', category: 'Soft Skills' } },
      { id: 'os-10', isRequired: false, skill: { name: 'NumPy', category: 'AI/ML' } },
    ],
  },
  {
    id: 'opp-3',
    title: 'Frontend Developer Intern',
    organization: 'PixelCraft Studio',
    description: 'Help build user interfaces for dynamic web apps. You should have a strong design eye and understand state management in modern frontend libraries.',
    type: 'Internship',
    location: 'Austin, TX',
    duration: '4 months',
    experienceLevel: 'Entry',
    workType: 'Hybrid',
    skills: [
      { id: 'os-11', isRequired: true, skill: { name: 'React', category: 'Web Development' } },
      { id: 'os-12', isRequired: true, skill: { name: 'JavaScript', category: 'Programming' } },
      { id: 'os-13', isRequired: true, skill: { name: 'HTML', category: 'Web Development' } },
      { id: 'os-14', isRequired: true, skill: { name: 'CSS', category: 'Web Development' } },
      { id: 'os-15', isRequired: false, skill: { name: 'Figma', category: 'Tools' } },
      { id: 'os-16', isRequired: false, skill: { name: 'TypeScript', category: 'Programming' } },
    ],
  },
  {
    id: 'opp-4',
    title: 'Backend Developer Intern',
    organization: 'ScaleGrid Systems',
    description: 'Work on building highly scalable backend database services. Optimize slow SQL queries and implement caching policies.',
    type: 'Internship',
    location: 'Seattle, WA',
    duration: '3 months',
    experienceLevel: 'Entry',
    workType: 'Remote',
    skills: [
      { id: 'os-17', isRequired: true, skill: { name: 'Node.js', category: 'Web Development' } },
      { id: 'os-18', isRequired: true, skill: { name: 'Express', category: 'Web Development' } },
      { id: 'os-19', isRequired: true, skill: { name: 'SQL', category: 'Database' } },
      { id: 'os-20', isRequired: false, skill: { name: 'Docker', category: 'Cloud' } },
      { id: 'os-21', isRequired: false, skill: { name: 'TypeScript', category: 'Programming' } },
      { id: 'os-22', isRequired: false, skill: { name: 'Redis', category: 'Database' } },
    ],
  },
  {
    id: 'opp-5',
    title: 'AI/ML Research Project',
    organization: 'FutureLabs Research',
    description: 'Research project focusing on fine-tuning vision transformers and convolutional neural networks for semantic image search engines.',
    type: 'Project',
    location: 'Remote',
    duration: '2 months',
    experienceLevel: 'Intermediate',
    workType: 'Remote',
    skills: [
      { id: 'os-23', isRequired: true, skill: { name: 'Python', category: 'Programming' } },
      { id: 'os-24', isRequired: true, skill: { name: 'PyTorch', category: 'AI/ML' } },
      { id: 'os-25', isRequired: false, skill: { name: 'Pandas', category: 'AI/ML' } },
      { id: 'os-26', isRequired: false, skill: { name: 'NumPy', category: 'AI/ML' } },
      { id: 'os-27', isRequired: false, skill: { name: 'Scikit-Learn', category: 'AI/ML' } },
    ],
  },
  {
    id: 'opp-6',
    title: 'Full Stack Developer',
    organization: 'CloudNest Technology',
    description: 'Responsible for our main SaaS customer web application. Implement complete end-to-end features from DB migration to CSS layout styling.',
    type: 'Job',
    location: 'Chicago, IL',
    duration: 'Full-time',
    experienceLevel: 'Advanced',
    workType: 'Onsite',
    skills: [
      { id: 'os-28', isRequired: true, skill: { name: 'React', category: 'Web Development' } },
      { id: 'os-29', isRequired: true, skill: { name: 'Node.js', category: 'Web Development' } },
      { id: 'os-30', isRequired: true, skill: { name: 'Express', category: 'Web Development' } },
      { id: 'os-31', isRequired: true, skill: { name: 'TypeScript', category: 'Programming' } },
      { id: 'os-32', isRequired: true, skill: { name: 'SQL', category: 'Database' } },
      { id: 'os-33', isRequired: true, skill: { name: 'Git', category: 'Tools' } },
      { id: 'os-34', isRequired: false, skill: { name: 'AWS', category: 'Cloud' } },
      { id: 'os-35', isRequired: false, skill: { name: 'Docker', category: 'Cloud' } },
    ],
  },
  {
    id: 'opp-7',
    title: 'Cloud Engineering Intern',
    organization: 'WebScale Corp',
    description: 'Work with the DevOps team to implement infrastructure as code and configure Docker containers for development databases.',
    type: 'Internship',
    location: 'San Jose, CA',
    duration: '6 months',
    experienceLevel: 'Entry',
    workType: 'Remote',
    skills: [
      { id: 'os-36', isRequired: true, skill: { name: 'AWS', category: 'Cloud' } },
      { id: 'os-37', isRequired: true, skill: { name: 'Docker', category: 'Cloud' } },
      { id: 'os-38', isRequired: true, skill: { name: 'Git', category: 'Tools' } },
      { id: 'os-39', isRequired: false, skill: { name: 'Kubernetes', category: 'Cloud' } },
      { id: 'os-40', isRequired: false, skill: { name: 'TypeScript', category: 'Programming' } },
    ],
  },
  {
    id: 'opp-8',
    title: 'Data Science Internship',
    organization: 'QuantAI Capital',
    description: 'Analyze trading datasets, run statistics, build predictive machine learning models, and report results to risk teams.',
    type: 'Internship',
    location: 'Boston, MA',
    duration: '6 months',
    experienceLevel: 'Entry',
    workType: 'Hybrid',
    skills: [
      { id: 'os-41', isRequired: true, skill: { name: 'Python', category: 'Programming' } },
      { id: 'os-42', isRequired: true, skill: { name: 'SQL', category: 'Database' } },
      { id: 'os-43', isRequired: true, skill: { name: 'TensorFlow', category: 'AI/ML' } },
      { id: 'os-44', isRequired: false, skill: { name: 'Pandas', category: 'AI/ML' } },
      { id: 'os-45', isRequired: false, skill: { name: 'Communication', category: 'Soft Skills' } },
    ],
  },
];

// Initial Career Paths
const INITIAL_CAREER_PATHS = [
  {
    id: 'cp-1',
    title: 'Software Developer',
    description: 'Designs, develops, tests, and maintains software applications. Focuses on core logic, algorithms, and application delivery.',
    averageSalary: '$95,000 - $130,000',
    demandLevel: 'High',
    skills: [
      { skill: { name: 'Java', category: 'Programming' } },
      { skill: { name: 'Python', category: 'Programming' } },
      { skill: { name: 'SQL', category: 'Database' } },
      { skill: { name: 'Git', category: 'Tools' } },
    ],
  },
  {
    id: 'cp-2',
    title: 'Backend Developer',
    description: 'Responsible for server-side logic, database interactions, API integrations, and system scalability.',
    averageSalary: '$100,000 - $140,000',
    demandLevel: 'High',
    skills: [
      { skill: { name: 'Node.js', category: 'Web Development' } },
      { skill: { name: 'Express', category: 'Web Development' } },
      { skill: { name: 'SQL', category: 'Database' } },
      { skill: { name: 'Docker', category: 'Cloud' } },
      { skill: { name: 'Redis', category: 'Database' } },
      { skill: { name: 'Git', category: 'Tools' } },
    ],
  },
  {
    id: 'cp-3',
    title: 'Frontend Developer',
    description: 'Creates client-side UI components, ensures excellent UX, responsive layouts, and builds interactive interfaces.',
    averageSalary: '$85,000 - $120,000',
    demandLevel: 'High',
    skills: [
      { skill: { name: 'React', category: 'Web Development' } },
      { skill: { name: 'JavaScript', category: 'Programming' } },
      { skill: { name: 'TypeScript', category: 'Programming' } },
      { skill: { name: 'HTML', category: 'Web Development' } },
      { skill: { name: 'CSS', category: 'Web Development' } },
      { skill: { name: 'Figma', category: 'Tools' } },
    ],
  },
  {
    id: 'cp-4',
    title: 'Full Stack Developer',
    description: 'Handles both client-side frontend and server-side backend logic, databases, and continuous delivery.',
    averageSalary: '$105,000 - $150,000',
    demandLevel: 'High',
    skills: [
      { skill: { name: 'React', category: 'Web Development' } },
      { skill: { name: 'Node.js', category: 'Web Development' } },
      { skill: { name: 'Express', category: 'Web Development' } },
      { skill: { name: 'TypeScript', category: 'Programming' } },
      { skill: { name: 'SQL', category: 'Database' } },
      { skill: { name: 'Git', category: 'Tools' } },
    ],
  },
  {
    id: 'cp-5',
    title: 'Data Analyst',
    description: 'Collects, processes, and performs statistical analyses of data to help companies make informed business decisions.',
    averageSalary: '$70,000 - $95,000',
    demandLevel: 'Medium',
    skills: [
      { skill: { name: 'Python', category: 'Programming' } },
      { skill: { name: 'SQL', category: 'Database' } },
      { skill: { name: 'Pandas', category: 'AI/ML' } },
      { skill: { name: 'NumPy', category: 'AI/ML' } },
      { skill: { name: 'Communication', category: 'Soft Skills' } },
    ],
  },
  {
    id: 'cp-6',
    title: 'AI/ML Engineer',
    description: 'Specializes in training, building, deploying, and optimizing machine learning models for production systems.',
    averageSalary: '$120,000 - $175,000',
    demandLevel: 'High',
    skills: [
      { skill: { name: 'Python', category: 'Programming' } },
      { skill: { name: 'PyTorch', category: 'AI/ML' } },
      { skill: { name: 'TensorFlow', category: 'AI/ML' } },
      { skill: { name: 'NumPy', category: 'AI/ML' } },
      { skill: { name: 'Scikit-Learn', category: 'AI/ML' } },
    ],
  },
];

// Initial Learning Resources
const INITIAL_RESOURCES = [
  { id: 'lr-1', title: 'Java Programming Masterclass', url: 'https://coursera.org/learn/java-introduction', type: 'Course', duration: '30 hours', provider: 'Coursera', skill: { name: 'Java' } },
  { id: 'lr-2', title: 'Complete SQL Bootcamp', url: 'https://udemy.com/course/the-complete-sql-bootcamp', type: 'Course', duration: '12 hours', provider: 'Udemy', skill: { name: 'SQL' } },
  { id: 'lr-3', title: 'React 18 & Redux Course', url: 'https://udemy.com/course/react-redux', type: 'Course', duration: '40 hours', provider: 'Udemy', skill: { name: 'React' } },
  { id: 'lr-4', title: 'Git & GitHub Complete Guide', url: 'https://youtube.com', type: 'Video', duration: '4 hours', provider: 'YouTube', skill: { name: 'Git' } },
  { id: 'lr-5', title: 'Understanding TypeScript', url: 'https://udemy.com/course/understanding-typescript', type: 'Course', duration: '15 hours', provider: 'Udemy', skill: { name: 'TypeScript' } },
  { id: 'lr-6', title: 'Node.js & Express Developer Bootcamp', url: 'https://udemy.com', type: 'Course', duration: '35 hours', provider: 'Udemy', skill: { name: 'Node.js' } },
  { id: 'lr-7', title: 'Docker for Beginners', url: 'https://coursera.org', type: 'Course', duration: '8 hours', provider: 'Coursera', skill: { name: 'Docker' } },
  { id: 'lr-8', title: 'Python for Everybody Specialization', url: 'https://coursera.org', type: 'Course', duration: '48 hours', provider: 'Coursera', skill: { name: 'Python' } },
  { id: 'lr-9', title: 'Data Analysis with Pandas', url: 'https://youtube.com', type: 'Video', duration: '6 hours', provider: 'YouTube', skill: { name: 'Pandas' } },
  { id: 'lr-10', title: 'Deep Learning with PyTorch', url: 'https://pytorch.org/tutorials', type: 'Article', duration: '10 hours', provider: 'PyTorch', skill: { name: 'PyTorch' } },
  { id: 'lr-11', title: 'AWS Solutions Architect Associate', url: 'https://udemy.com', type: 'Course', duration: '27 hours', provider: 'Udemy', skill: { name: 'AWS' } },
];

// Helper to get / set from localStorage
function getStorage<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(`skillmatch_${key}`);
    return item ? JSON.parse(item) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setStorage<T>(key: string, val: T): void {
  try {
    localStorage.setItem(`skillmatch_${key}`, JSON.stringify(val));
  } catch (e) {
    console.error('Failed to write to localStorage', e);
  }
}

export const mockStore = {
  login(email: string, password: string) {
    const trimmedEmail = email.trim().toLowerCase();
    
    // Check demo credentials
    if (trimmedEmail === 'student@skillmatch.com') {
      if (password && password !== 'student123') {
        throw new Error('Incorrect password. For student demo, use: student123');
      }
      return {
        token: 'mock_token_student_session',
        user: {
          id: 'student_user_1',
          email: 'student@skillmatch.com',
          role: 'STUDENT',
          name: 'Omkar Eswar',
        },
      };
    }

    if (trimmedEmail === 'admin@skillmatch.com') {
      if (password && password !== 'admin123') {
        throw new Error('Incorrect password. For admin demo, use: admin123');
      }
      return {
        token: 'mock_token_admin_session',
        user: {
          id: 'admin_user_1',
          email: 'admin@skillmatch.com',
          role: 'ADMIN',
          name: 'Administrator',
        },
      };
    }

    // Allow user to log in if email contains student or admin
    if (trimmedEmail.includes('student')) {
      return {
        token: 'mock_token_student_session',
        user: {
          id: 'student_user_1',
          email: trimmedEmail,
          role: 'STUDENT',
          name: 'Student Demo User',
        },
      };
    }

    if (trimmedEmail.includes('admin')) {
      return {
        token: 'mock_token_admin_session',
        user: {
          id: 'admin_user_1',
          email: trimmedEmail,
          role: 'ADMIN',
          name: 'Administrator',
        },
      };
    }

    throw new Error('Invalid email or password. Please use demo credentials: student@skillmatch.com / student123 or admin@skillmatch.com / admin123');
  },

  getProfile() {
    return getStorage('profile', {
      id: 'student_1',
      name: 'Omkar Eswar',
      phone: '+1 (555) 019-2834',
      location: 'San Francisco, CA',
      degree: 'Bachelor of Science',
      department: 'Computer Science',
      university: 'State University',
      graduationYear: 2027,
      experienceLevel: 'Entry',
      projects: '1. Personal Portfolio Website built with HTML/CSS/JS\n2. Simple Task Manager CLI in Java\n3. Weather App using React and OpenWeather API',
      internshipExperience: 'None yet - looking for a summer 2026/2027 internship.',
      interests: 'Software Development,Web Development,AI/ML',
      preferredRole: 'Software Developer',
      preferredIndustry: 'Technology',
      preferredLocation: 'San Francisco, CA or Remote',
      workType: 'Remote',
      user: { email: 'student@skillmatch.com' },
    });
  },

  updateProfile(profileData: any) {
    const current = this.getProfile();
    const updated = { ...current, ...profileData };
    setStorage('profile', updated);
    return updated;
  },

  getResumeProfile() {
    return getStorage('resume_profile', null);
  },

  setResumeProfile(resumeProfile: any) {
    setStorage('resume_profile', resumeProfile);

    // If new resume has detected skills, merge into student skills
    if (resumeProfile && Array.isArray(resumeProfile.detectedSkills)) {
      const skills = getStorage('student_skills', INITIAL_STUDENT_SKILLS);
      resumeProfile.detectedSkills.forEach((ds: any) => {
        const existingIdx = skills.findIndex((s: any) => s.skill.name.toLowerCase() === ds.name.toLowerCase());
        if (existingIdx >= 0) {
          skills[existingIdx].proficiency = ds.proficiency || skills[existingIdx].proficiency;
        } else {
          let masterSkill = MASTER_SKILLS.find(s => s.name.toLowerCase() === ds.name.toLowerCase());
          if (!masterSkill) {
            masterSkill = {
              id: `sk_${ds.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
              name: ds.name,
              category: ds.category || 'General',
            };
          }
          skills.push({
            id: `ss_${ds.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
            skillId: masterSkill.id,
            skill: masterSkill,
            proficiency: ds.proficiency || 'Intermediate',
          });
        }
      });
      setStorage('student_skills', skills);
    }

    // Update career direction if inferred from resume
    if (resumeProfile?.careerDirection) {
      this.updateProfile({ preferredRole: resumeProfile.careerDirection });
    }

    return resumeProfile;
  },

  getSkills() {
    const studentSkills = getStorage('student_skills', INITIAL_STUDENT_SKILLS);
    return {
      studentSkills,
      allSkills: MASTER_SKILLS,
    };
  },

  addSkill(skillData: { skillId?: string; skillName?: string; category?: string; proficiency: string }) {
    const skills = getStorage('student_skills', INITIAL_STUDENT_SKILLS);
    let masterSkill = MASTER_SKILLS.find(s => s.id === skillData.skillId);
    if (!masterSkill && skillData.skillName) {
      masterSkill = MASTER_SKILLS.find(s => s.name.toLowerCase() === skillData.skillName?.toLowerCase());
    }

    if (!masterSkill) {
      masterSkill = {
        id: `sk_custom_${Date.now()}`,
        name: skillData.skillName || 'Skill',
        category: skillData.category || 'General',
      };
    }

    const existingIndex = skills.findIndex((s: any) => s.skill.name.toLowerCase() === masterSkill!.name.toLowerCase());
    if (existingIndex >= 0) {
      skills[existingIndex].proficiency = skillData.proficiency;
    } else {
      skills.push({
        id: `ss_${Date.now()}`,
        skillId: masterSkill.id,
        skill: masterSkill,
        proficiency: skillData.proficiency,
      });
    }

    setStorage('student_skills', skills);
    return { message: 'Skill saved successfully' };
  },

  removeSkill(skillId: string) {
    let skills = getStorage('student_skills', INITIAL_STUDENT_SKILLS);
    skills = skills.filter((s: any) => s.id !== skillId && s.skillId !== skillId && s.skill.id !== skillId);
    setStorage('student_skills', skills);
    return { message: 'Skill removed successfully' };
  },

  getOpportunities(filters: { type?: string; search?: string; skill?: string } = {}) {
    const profile = this.getProfile();
    const { studentSkills } = this.getSkills();
    const opps: any[] = getStorage('opportunities', INITIAL_OPPORTUNITIES);
    const saved = getStorage<string[]>('saved_opp_ids', []);

    const studentProfileData: StudentProfileData = {
      degree: profile.degree,
      department: profile.department,
      experienceLevel: profile.experienceLevel,
      interests: profile.interests,
      preferredRole: profile.preferredRole,
      preferredIndustry: profile.preferredIndustry,
      preferredLocation: profile.preferredLocation,
      workType: profile.workType,
      skills: studentSkills.map((s: any) => ({
        name: s.skill.name,
        category: s.skill.category,
        proficiency: s.proficiency,
      })),
    };

    let results = opps.map((opp: any) => {
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
        skills: opp.skills.map((s: any) => ({
          name: s.skill.name,
          category: s.skill.category,
          isRequired: s.isRequired,
        })),
      };

      const matchDetails = MatchingEngine.calculateMatch(studentProfileData, oppData);

      return {
        ...opp,
        matchScore: matchDetails.score,
        matchDetails,
        isSaved: saved.includes(opp.id),
      };
    });

    if (filters.type && filters.type !== 'All') {
      results = results.filter(o => o.type.toLowerCase() === filters.type!.toLowerCase());
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(o => 
        o.title.toLowerCase().includes(q) || 
        o.organization.toLowerCase().includes(q) || 
        o.description.toLowerCase().includes(q)
      );
    }

    if (filters.skill) {
      const s = filters.skill.toLowerCase();
      results = results.filter(o => 
        o.skills.some((sk: any) => sk.skill.name.toLowerCase().includes(s))
      );
    }

    return results;
  },

  getOpportunityDetails(id: string) {
    const opps = this.getOpportunities();
    const found = opps.find((o: any) => o.id === id);
    if (!found) throw new Error('Opportunity not found');
    return found;
  },

  getSavedOpportunities() {
    const opps = this.getOpportunities();
    const savedIds = getStorage<string[]>('saved_opp_ids', ['opp-1']);
    return opps
      .filter((o: any) => savedIds.includes(o.id))
      .map((o: any) => ({
        id: `saved_${o.id}`,
        opportunityId: o.id,
        opportunity: o,
      }));
  },

  saveOpportunity(opportunityId: string) {
    const savedIds = getStorage<string[]>('saved_opp_ids', []);
    if (!savedIds.includes(opportunityId)) {
      savedIds.push(opportunityId);
      setStorage('saved_opp_ids', savedIds);
    }
    return { message: 'Opportunity saved' };
  },

  unsaveOpportunity(opportunityId: string) {
    let savedIds = getStorage<string[]>('saved_opp_ids', []);
    savedIds = savedIds.filter(id => id !== opportunityId);
    setStorage('saved_opp_ids', savedIds);
    return { message: 'Opportunity removed from saved' };
  },

  getMatches() {
    const opps = this.getOpportunities();
    return opps.sort((a, b) => b.matchScore - a.matchScore);
  },

  getSkillGaps() {
    const opps = this.getMatches();
    const gapMap: Record<string, { name: string; priority: 'High' | 'Medium' | 'Low'; count: number }> = {};

    opps.slice(0, 5).forEach((opp: any) => {
      opp.matchDetails?.missingSkills?.forEach((missing: any) => {
        if (!gapMap[missing.name]) {
          gapMap[missing.name] = { name: missing.name, priority: missing.priority, count: 1 };
        } else {
          gapMap[missing.name].count++;
        }
      });
    });

    return Object.values(gapMap).sort((a, b) => (a.priority === 'High' ? -1 : 1));
  },

  getCareerPaths() {
    const { studentSkills } = this.getSkills();
    const studentSkillNames = studentSkills.map((s: any) => s.skill.name.toLowerCase());

    return INITIAL_CAREER_PATHS.map(cp => {
      const required = cp.skills.map(s => s.skill.name);
      const matched = required.filter(name => studentSkillNames.includes(name.toLowerCase()));
      const score = Math.round((matched.length / required.length) * 100);

      return {
        ...cp,
        compatibilityScore: score,
        matchedSkills: matched,
        missingSkills: required.filter(name => !studentSkillNames.includes(name.toLowerCase())),
      };
    }).sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  },

  getLearningPath() {
    const resumeProfile = this.getResumeProfile();
    const studentProfile = this.getProfile();
    const { studentSkills } = this.getSkills();
    const opportunities = this.getMatches();

    const plan = ResourceRecommendationEngine.generatePlan({
      resumeProfile,
      studentProfile,
      currentSkills: studentSkills.map((s: any) => ({
        name: s.skill?.name || s.name,
        category: s.skill?.category || s.category,
        proficiency: s.proficiency || 'Intermediate',
      })),
      opportunities,
    });

    return plan;
  },

  applyOpportunity(_opportunityId: string) {
    return { message: 'Application submitted successfully!' };
  },

  getApplications() {
    return [
      {
        id: 'app-1',
        opportunityId: 'opp-1',
        status: 'UNDER_REVIEW',
        appliedAt: new Date().toISOString(),
        opportunity: INITIAL_OPPORTUNITIES[0],
      },
    ];
  },

  getAdminStatistics() {
    const opps = getStorage('opportunities', INITIAL_OPPORTUNITIES);
    return {
      summary: {
        totalStudents: 142,
        totalOpportunities: opps.length,
        totalSkills: 33,
        totalMatches: 486,
      },
      charts: {
        averageMatchScore: 78,
        opportunityTypes: [
          { name: 'Internship', value: opps.filter((o: any) => o.type === 'Internship').length },
          { name: 'Job', value: opps.filter((o: any) => o.type === 'Job').length },
          { name: 'Project', value: opps.filter((o: any) => o.type === 'Project').length },
        ],
        popularSkills: [
          { name: 'Python', count: 98 },
          { name: 'SQL', count: 86 },
          { name: 'React', count: 74 },
          { name: 'Java', count: 68 },
          { name: 'Git', count: 65 },
          { name: 'AWS', count: 42 },
        ],
        careerPathRecommendations: [
          { name: 'Software Developer', students: 84 },
          { name: 'Frontend Developer', students: 62 },
          { name: 'Full Stack Developer', students: 58 },
          { name: 'Data Analyst', students: 46 },
          { name: 'Backend Developer', students: 39 },
        ],
      },
    };
  },

  getAdminStudents() {
    return [
      {
        id: 'student_1',
        name: 'Omkar Eswar',
        degree: 'Bachelor of Science',
        department: 'Computer Science',
        experienceLevel: 'Entry',
        user: { email: 'student@skillmatch.com' },
        skills: [
          { skill: { name: 'Java' }, proficiency: 'Intermediate' },
          { skill: { name: 'SQL' }, proficiency: 'Intermediate' },
          { skill: { name: 'React' }, proficiency: 'Beginner' },
        ],
      },
      {
        id: 'student_2',
        name: 'Sarah Jenkins',
        degree: 'Bachelor of Engineering',
        department: 'Information Technology',
        experienceLevel: 'Intermediate',
        user: { email: 'sarah.j@example.com' },
        skills: [
          { skill: { name: 'Python' }, proficiency: 'Advanced' },
          { skill: { name: 'Pandas' }, proficiency: 'Intermediate' },
          { skill: { name: 'SQL' }, proficiency: 'Advanced' },
        ],
      },
      {
        id: 'student_3',
        name: 'Alex Rivera',
        degree: 'Bachelor of Science',
        department: 'Data Science',
        experienceLevel: 'Entry',
        user: { email: 'alex.r@example.com' },
        skills: [
          { skill: { name: 'Python' }, proficiency: 'Intermediate' },
          { skill: { name: 'PyTorch' }, proficiency: 'Beginner' },
          { skill: { name: 'Git' }, proficiency: 'Intermediate' },
        ],
      },
    ];
  },

  createOpportunity(oppData: any) {
    const opps = getStorage('opportunities', INITIAL_OPPORTUNITIES);
    const newOpp = {
      id: `opp_${Date.now()}`,
      ...oppData,
      skills: (oppData.skills || []).map((s: any, idx: number) => ({
        id: `os_new_${idx}`,
        isRequired: s.isRequired ?? true,
        skill: { name: s.name || s.skillName || 'General', category: 'General' },
      })),
    };
    opps.push(newOpp);
    setStorage('opportunities', opps);
    return newOpp;
  },

  updateOpportunity(id: string, oppData: any) {
    const opps = getStorage('opportunities', INITIAL_OPPORTUNITIES);
    const index = opps.findIndex((o: any) => o.id === id);
    if (index >= 0) {
      opps[index] = { ...opps[index], ...oppData };
      setStorage('opportunities', opps);
      return opps[index];
    }
    throw new Error('Opportunity not found');
  },

  deleteOpportunity(id: string) {
    let opps = getStorage('opportunities', INITIAL_OPPORTUNITIES);
    opps = opps.filter((o: any) => o.id !== id);
    setStorage('opportunities', opps);
    return { message: 'Opportunity deleted successfully' };
  },
};
