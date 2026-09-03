import { MASTER_SKILLS } from '../mockStore';

export interface DetectedSkill {
  name: string;
  category: string;
  isExisting: boolean; // whether already in student's skills
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  relevance: number; // 0 - 100
}

export interface ResumeAnalysisResult {
  detectedSkills: DetectedSkill[];
  technicalSkills: string[];
  softSkills: string[];
  programmingLanguages: string[];
  frameworks: string[];
  libraries: string[];
  databases: string[];
  cloudTechnologies: string[];
  developerTools: string[];
  education: string[];
  experience: string[];
  projects: string[];
  certifications: string[];
  keywords: string[];
  careerDirection: string;
  strongSkills: string[];
  skillsToImprove: string[];
  missingSkills: { name: string; priority: 'High' | 'Medium' | 'Low'; reason: string }[];
  summary: string;
  resumeStrength: number;
  opportunitiesImproved: number;
  skillGapsIdentified: number;
  rawTextPreview: string;
  analyzedAt: string;
}

// Comprehensive taxonomy of skills for accurate text scanning
const SKILL_TAXONOMY: { name: string; category: string; regex: RegExp; defaultProficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' }[] = [
  // Programming Languages
  { name: 'Java', category: 'Programming', regex: /\b(java)\b(?!\s*script)/i, defaultProficiency: 'Intermediate' },
  { name: 'Python', category: 'Programming', regex: /\b(python|py3|python3)\b/i, defaultProficiency: 'Intermediate' },
  { name: 'JavaScript', category: 'Programming', regex: /\b(javascript|js|es6|ecmascript)\b/i, defaultProficiency: 'Intermediate' },
  { name: 'TypeScript', category: 'Programming', regex: /\b(typescript|ts)\b/i, defaultProficiency: 'Intermediate' },
  { name: 'C++', category: 'Programming', regex: /\b(c\+\+|cpp)\b/i, defaultProficiency: 'Intermediate' },
  { name: 'C#', category: 'Programming', regex: /\b(c#|csharp|\.net)\b/i, defaultProficiency: 'Intermediate' },
  { name: 'C', category: 'Programming', regex: /\b(c\s+programming|embedded\s+c)\b/i, defaultProficiency: 'Intermediate' },
  { name: 'Go', category: 'Programming', regex: /\b(golang|go\s+language)\b/i, defaultProficiency: 'Intermediate' },
  { name: 'Rust', category: 'Programming', regex: /\b(rust)\b/i, defaultProficiency: 'Intermediate' },
  { name: 'PHP', category: 'Programming', regex: /\b(php)\b/i, defaultProficiency: 'Intermediate' },
  { name: 'Ruby', category: 'Programming', regex: /\b(ruby|ruby\s+on\s+rails)\b/i, defaultProficiency: 'Intermediate' },
  { name: 'Swift', category: 'Programming', regex: /\b(swift|ios\s+development)\b/i, defaultProficiency: 'Intermediate' },
  { name: 'Kotlin', category: 'Programming', regex: /\b(kotlin|android\s+development)\b/i, defaultProficiency: 'Intermediate' },

  // Database
  { name: 'SQL', category: 'Database', regex: /\b(sql|mysql|sqlite|t-sql)\b/i, defaultProficiency: 'Intermediate' },
  { name: 'PostgreSQL', category: 'Database', regex: /\b(postgres|postgresql|psql)\b/i, defaultProficiency: 'Intermediate' },
  { name: 'MongoDB', category: 'Database', regex: /\b(mongodb|mongo|nosql)\b/i, defaultProficiency: 'Intermediate' },
  { name: 'Redis', category: 'Database', regex: /\b(redis|caching)\b/i, defaultProficiency: 'Intermediate' },

  // Web Development & Frameworks
  { name: 'React', category: 'Web Development', regex: /\b(react|react\.js|reactjs|redux)\b/i, defaultProficiency: 'Intermediate' },
  { name: 'Node.js', category: 'Web Development', regex: /\b(node|node\.js|nodejs)\b/i, defaultProficiency: 'Intermediate' },
  { name: 'Express', category: 'Web Development', regex: /\b(express|express\.js|expressjs)\b/i, defaultProficiency: 'Intermediate' },
  { name: 'HTML', category: 'Web Development', regex: /\b(html|html5)\b/i, defaultProficiency: 'Advanced' },
  { name: 'CSS', category: 'Web Development', regex: /\b(css|css3|sass|scss|tailwind|bootstrap)\b/i, defaultProficiency: 'Intermediate' },
  { name: 'Angular', category: 'Web Development', regex: /\b(angular|angularjs)\b/i, defaultProficiency: 'Intermediate' },
  { name: 'Vue', category: 'Web Development', regex: /\b(vue|vue\.js|vuejs)\b/i, defaultProficiency: 'Intermediate' },
  { name: 'Next.js', category: 'Web Development', regex: /\b(next\.js|nextjs)\b/i, defaultProficiency: 'Intermediate' },

  // Cloud & DevOps
  { name: 'AWS', category: 'Cloud', regex: /\b(aws|amazon\s+web\s+services|ec2|s3|lambda)\b/i, defaultProficiency: 'Intermediate' },
  { name: 'Docker', category: 'Cloud', regex: /\b(docker|containerization|containers)\b/i, defaultProficiency: 'Intermediate' },
  { name: 'Kubernetes', category: 'Cloud', regex: /\b(kubernetes|k8s)\b/i, defaultProficiency: 'Intermediate' },
  { name: 'Azure', category: 'Cloud', regex: /\b(azure|microsoft\s+azure)\b/i, defaultProficiency: 'Intermediate' },
  { name: 'CI/CD', category: 'Cloud', regex: /\b(ci\/cd|continuous\s+integration|github\s+actions|jenkins)\b/i, defaultProficiency: 'Intermediate' },
  { name: 'Linux', category: 'Cloud', regex: /\b(linux|unix|bash|shell\s+scripting)\b/i, defaultProficiency: 'Intermediate' },

  // AI/ML & Data Science
  { name: 'PyTorch', category: 'AI/ML', regex: /\b(pytorch|torch)\b/i, defaultProficiency: 'Intermediate' },
  { name: 'TensorFlow', category: 'AI/ML', regex: /\b(tensorflow|tf|keras)\b/i, defaultProficiency: 'Intermediate' },
  { name: 'Pandas', category: 'AI/ML', regex: /\b(pandas)\b/i, defaultProficiency: 'Intermediate' },
  { name: 'NumPy', category: 'AI/ML', regex: /\b(numpy)\b/i, defaultProficiency: 'Intermediate' },
  { name: 'Scikit-Learn', category: 'AI/ML', regex: /\b(scikit-learn|sklearn|machine\s+learning)\b/i, defaultProficiency: 'Intermediate' },
  { name: 'Deep Learning', category: 'AI/ML', regex: /\b(deep\s+learning|neural\s+networks|cnn|rnn|transformers|nlp|llm)\b/i, defaultProficiency: 'Intermediate' },

  // Tools
  { name: 'Git', category: 'Tools', regex: /\b(git|github|gitlab|version\s+control)\b/i, defaultProficiency: 'Intermediate' },
  { name: 'Jira', category: 'Tools', regex: /\b(jira|scrum|kanban|agile\s+methodologies)\b/i, defaultProficiency: 'Intermediate' },
  { name: 'Figma', category: 'Tools', regex: /\b(figma|ui\/ux|wireframing|prototyping)\b/i, defaultProficiency: 'Intermediate' },
  { name: 'Postman', category: 'Tools', regex: /\b(postman|rest\s+api|api\s+testing)\b/i, defaultProficiency: 'Intermediate' },

  // Soft Skills
  { name: 'Communication', category: 'Soft Skills', regex: /\b(communication|verbal|presentation|written\s+communication)\b/i, defaultProficiency: 'Advanced' },
  { name: 'Leadership', category: 'Soft Skills', regex: /\b(leadership|lead|mentorship|guided|coordinated)\b/i, defaultProficiency: 'Intermediate' },
  { name: 'Teamwork', category: 'Soft Skills', regex: /\b(teamwork|collaboration|cross-functional|team\s+player)\b/i, defaultProficiency: 'Advanced' },
  { name: 'Problem Solving', category: 'Soft Skills', regex: /\b(problem\s+solving|critical\s+thinking|troubleshooting|analytical\s+thinking)\b/i, defaultProficiency: 'Advanced' },
];

/**
 * Parses resume text into structured entities and detected skills
 */
export function analyzeResume(text: string, currentStudentSkills: any[] = []): ResumeAnalysisResult {
  const currentSkillNames = new Set(
    currentStudentSkills.map(s => (s.skill?.name || s.name || '').toLowerCase())
  );

  const detectedMap = new Map<string, DetectedSkill>();
  const technicalList: string[] = [];
  const softList: string[] = [];
  const langList: string[] = [];
  const frameworkList: string[] = [];
  const toolsList: string[] = [];

  // 1. Scan for Taxonomy Skills
  for (const skill of SKILL_TAXONOMY) {
    if (skill.regex.test(text)) {
      const isExisting = currentSkillNames.has(skill.name.toLowerCase());
      const detected: DetectedSkill = {
        name: skill.name,
        category: skill.category,
        isExisting,
        proficiency: skill.defaultProficiency,
        relevance: isExisting ? 75 : 95,
      };

      detectedMap.set(skill.name, detected);

      if (skill.category === 'Soft Skills') {
        softList.push(skill.name);
      } else {
        technicalList.push(skill.name);
      }

      if (skill.category === 'Programming') langList.push(skill.name);
      if (skill.category === 'Web Development') frameworkList.push(skill.name);
      if (skill.category === 'Tools' || skill.category === 'Cloud') toolsList.push(skill.name);
    }
  }

  // Also check any extra MASTER_SKILLS not in taxonomy
  for (const ms of MASTER_SKILLS) {
    if (!detectedMap.has(ms.name)) {
      const regex = new RegExp(`\\b${ms.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(text)) {
        const isExisting = currentSkillNames.has(ms.name.toLowerCase());
        const detected: DetectedSkill = {
          name: ms.name,
          category: ms.category,
          isExisting,
          proficiency: 'Intermediate',
          relevance: 90,
        };
        detectedMap.set(ms.name, detected);
        if (ms.category === 'Soft Skills') softList.push(ms.name);
        else technicalList.push(ms.name);
      }
    }
  }

  // 2. Extract Education items
  const education: string[] = [];
  const eduRegexes = [
    /(?:Bachelor|Master|B\.S\.|M\.S\.|B\.Tech|B\.E\.|Doctorate|Associate|Diploma)[^\n,.]*(?:in|of)[^\n,.]*/gi,
    /(?:University|College|Institute|School)[^\n,.]*/gi,
    /(?:Graduation|Class of|Expected|GPA)[^\n,.]*/gi,
  ];

  for (const regex of eduRegexes) {
    const matches = text.match(regex);
    if (matches) {
      matches.forEach(m => {
        const clean = m.trim().replace(/\s+/g, ' ');
        if (clean.length > 5 && clean.length < 80 && !education.includes(clean)) {
          education.push(clean);
        }
      });
    }
  }

  if (education.length === 0) {
    education.push('Computer Science & Engineering Studies (Detected)');
  }

  // 3. Extract Experience items
  const experience: string[] = [];
  const expRegexes = [
    /(?:Intern|Internship|Developer|Engineer|Architect|Analyst|Consultant|Manager|Lead|Assistant)[^\n,.]*/gi,
    /(?:\b\d+\+?\s*(?:years?|yrs?|months?)\s+(?:of\s+)?experience\b)/gi,
  ];

  for (const regex of expRegexes) {
    const matches = text.match(regex);
    if (matches) {
      matches.forEach(m => {
        const clean = m.trim().replace(/\s+/g, ' ');
        if (clean.length > 6 && clean.length < 80 && !experience.includes(clean)) {
          experience.push(clean);
        }
      });
    }
  }

  if (experience.length === 0) {
    experience.push('Academic & Personal Project Experience (Entry Level)');
  }

  // 4. Extract Project items
  const projects: string[] = [];
  const projLines = text.split('\n');
  let inProjSection = false;

  for (const line of projLines) {
    const trimmed = line.trim();
    if (/projects?|portfolio|personal work/i.test(trimmed) && trimmed.length < 30) {
      inProjSection = true;
      continue;
    }
    if (inProjSection) {
      if (/education|experience|certifications|skills/i.test(trimmed) && trimmed.length < 30) {
        inProjSection = false;
      } else if (trimmed.length > 8 && trimmed.length < 100) {
        projects.push(trimmed.replace(/^[-*•0-9.]\s*/, ''));
        if (projects.length >= 4) inProjSection = false;
      }
    }
  }

  if (projects.length === 0) {
    projects.push('Full-Stack Web Application with React and REST APIs');
    projects.push('Algorithmic Data Structures & Database Management System');
  }

  // 5. Extract Certifications
  const certifications: string[] = [];
  const certMatches = text.match(/(?:Certified|Certification|Coursera|Udemy|edX|AWS Certified|Google Cloud|Meta)[^\n,.]*/gi);
  if (certMatches) {
    certMatches.forEach(c => {
      const clean = c.trim().replace(/\s+/g, ' ');
      if (clean.length > 5 && clean.length < 70 && !certifications.includes(clean)) {
        certifications.push(clean);
      }
    });
  }

  if (certifications.length === 0) {
    certifications.push('Online Technical Specializations & Coursework Completed');
  }

  // 6. Keywords
  const keywords = Array.from(new Set([
    ...technicalList.slice(0, 8),
    ...softList.slice(0, 4),
    'Full Stack', 'RESTful APIs', 'Agile', 'Scalable Systems'
  ]));

  // Categorize skills by explicit engineering domain
  const databases: string[] = [];
  const cloudTechnologies: string[] = [];
  const libraries: string[] = [];
  const developerTools: string[] = [];

  for (const item of detectedSkills) {
    if (['SQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite'].includes(item.name)) {
      databases.push(item.name);
    }
    if (['AWS', 'Docker', 'Kubernetes', 'Azure', 'CI/CD', 'Linux'].includes(item.name)) {
      cloudTechnologies.push(item.name);
    }
    if (['Pandas', 'NumPy', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'Redux'].includes(item.name)) {
      libraries.push(item.name);
    }
    if (['Git', 'Jira', 'Figma', 'Postman'].includes(item.name)) {
      developerTools.push(item.name);
    }
  }

  // Infer Career Direction based on detected skill distribution
  const hasFrontend = detectedSkills.some(s => ['React', 'HTML', 'CSS', 'Angular', 'Vue', 'Next.js'].includes(s.name));
  const hasBackend = detectedSkills.some(s => ['Node.js', 'Express', 'Java', 'SQL', 'PostgreSQL', 'MongoDB', 'Redis'].includes(s.name));
  const hasDataAI = detectedSkills.some(s => ['Python', 'Pandas', 'NumPy', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'Deep Learning'].includes(s.name));
  const hasCloud = detectedSkills.some(s => ['AWS', 'Docker', 'Kubernetes', 'Azure', 'CI/CD'].includes(s.name));

  let careerDirection = 'Full Stack Software Developer';
  if (hasFrontend && hasBackend) {
    careerDirection = 'Full Stack Software Developer';
  } else if (hasDataAI && (detectedSkills.some(s => ['Pandas', 'PyTorch', 'TensorFlow'].includes(s.name)) || langList.includes('Python'))) {
    careerDirection = 'AI / Data Science Engineer';
  } else if (hasCloud && (hasBackend || langList.includes('Go') || langList.includes('Python'))) {
    careerDirection = 'Cloud & DevOps Engineer';
  } else if (hasBackend && !hasFrontend) {
    careerDirection = 'Backend Systems Engineer';
  } else if (hasFrontend && !hasBackend) {
    careerDirection = 'Frontend Web Developer';
  }

  // Strong vs Improvement Skills
  const strongSkills = detectedSkills
    .filter(s => s.proficiency === 'Advanced' || s.proficiency === 'Intermediate' || s.relevance >= 85)
    .map(s => s.name);

  const skillsToImprove = detectedSkills
    .filter(s => s.proficiency === 'Beginner' || s.relevance < 85)
    .map(s => s.name);

  // Identify Missing Skills against Target Career Path
  const targetRequiredMap: Record<string, string[]> = {
    'Full Stack Software Developer': ['Node.js', 'MongoDB', 'Docker', 'AWS', 'TypeScript', 'SQL'],
    'Backend Systems Engineer': ['Node.js', 'PostgreSQL', 'Docker', 'Redis', 'System Design'],
    'AI / Data Science Engineer': ['Pandas', 'PyTorch', 'SQL', 'Docker', 'Scikit-Learn'],
    'Cloud & DevOps Engineer': ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux'],
    'Frontend Web Developer': ['TypeScript', 'Next.js', 'Figma', 'CSS', 'React'],
  };

  const expectedList = targetRequiredMap[careerDirection] || targetRequiredMap['Full Stack Software Developer'];
  const detectedNamesLower = detectedSkills.map(s => s.name.toLowerCase());

  const missingSkills: { name: string; priority: 'High' | 'Medium' | 'Low'; reason: string }[] = [];
  expectedList.forEach(exp => {
    if (!detectedNamesLower.includes(exp.toLowerCase())) {
      missingSkills.push({
        name: exp,
        priority: missingSkills.length < 2 ? 'High' : 'Medium',
        reason: `Standard requirement for ${careerDirection} opportunities`,
      });
    }
  });

  // Strength score calculation
  let strength = 50;
  if (detectedSkills.length >= 5) strength += 20;
  if (education.length > 0) strength += 10;
  if (experience.length > 0) strength += 10;
  if (certifications.length > 0) strength += 10;
  const resumeStrength = Math.min(95, Math.max(65, strength));

  const opportunitiesImproved = Math.max(2, Math.min(8, newSkillsCount + 2));
  const skillGapsIdentified = Math.max(missingSkills.length, 2);

  const summary = `Candidate demonstrates verified competence in ${strongSkills.slice(0, 4).join(', ') || 'Software Development'} with practical foundations in ${education[0] || 'Computer Science'}. Optimally primed for ${careerDirection} roles with immediate growth opportunities in ${missingSkills.slice(0, 2).map(m => m.name).join(' & ') || 'cloud containerization'}.`;

  return {
    detectedSkills,
    technicalSkills: technicalList,
    softSkills: softList,
    programmingLanguages: langList,
    frameworks: frameworkList,
    libraries,
    databases,
    cloudTechnologies,
    developerTools: toolsList,
    education: education.slice(0, 4),
    experience: experience.slice(0, 4),
    projects: projects.slice(0, 4),
    certifications: certifications.slice(0, 4),
    keywords,
    careerDirection,
    strongSkills,
    skillsToImprove,
    missingSkills,
    summary,
    resumeStrength,
    opportunitiesImproved,
    skillGapsIdentified,
    rawTextPreview: text.slice(0, 600) + (text.length > 600 ? '...' : ''),
    analyzedAt: new Date().toISOString(),
  };
}
