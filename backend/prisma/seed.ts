import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean up
  await prisma.application.deleteMany();
  await prisma.savedOpportunity.deleteMany();
  await prisma.matchResult.deleteMany();
  await prisma.learningResource.deleteMany();
  await prisma.careerPathSkill.deleteMany();
  await prisma.careerPath.deleteMany();
  await prisma.opportunitySkill.deleteMany();
  await prisma.opportunity.deleteMany();
  await prisma.studentSkill.deleteMany();
  await prisma.student.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const studentPasswordHash = bcrypt.hashSync('student123', 10);
  const adminPasswordHash = bcrypt.hashSync('admin123', 10);

  const studentUser = await prisma.user.create({
    data: {
      email: 'student@skillmatch.com',
      passwordHash: studentPasswordHash,
      role: 'STUDENT',
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@skillmatch.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  });

  // Create Student profile
  const student = await prisma.student.create({
    data: {
      userId: studentUser.id,
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
    },
  });

  // Create Skills
  const skillsData = [
    // Programming
    { name: 'Java', category: 'Programming' },
    { name: 'Python', category: 'Programming' },
    { name: 'JavaScript', category: 'Programming' },
    { name: 'TypeScript', category: 'Programming' },
    { name: 'C++', category: 'Programming' },
    { name: 'C#', category: 'Programming' },
    // Database
    { name: 'SQL', category: 'Database' },
    { name: 'PostgreSQL', category: 'Database' },
    { name: 'MongoDB', category: 'Database' },
    { name: 'Redis', category: 'Database' },
    // Web Development
    { name: 'React', category: 'Web Development' },
    { name: 'Node.js', category: 'Web Development' },
    { name: 'Express', category: 'Web Development' },
    { name: 'HTML', category: 'Web Development' },
    { name: 'CSS', category: 'Web Development' },
    { name: 'Angular', category: 'Web Development' },
    // Cloud
    { name: 'AWS', category: 'Cloud' },
    { name: 'Docker', category: 'Cloud' },
    { name: 'Kubernetes', category: 'Cloud' },
    { name: 'Azure', category: 'Cloud' },
    // AI/ML
    { name: 'PyTorch', category: 'AI/ML' },
    { name: 'TensorFlow', category: 'AI/ML' },
    { name: 'Pandas', category: 'AI/ML' },
    { name: 'NumPy', category: 'AI/ML' },
    { name: 'Scikit-Learn', category: 'AI/ML' },
    // Soft Skills
    { name: 'Communication', category: 'Soft Skills' },
    { name: 'Leadership', category: 'Soft Skills' },
    { name: 'Teamwork', category: 'Soft Skills' },
    { name: 'Problem Solving', category: 'Soft Skills' },
    // Tools
    { name: 'Git', category: 'Tools' },
    { name: 'Jira', category: 'Tools' },
    { name: 'Figma', category: 'Tools' },
    { name: 'Postman', category: 'Tools' },
  ];

  const skillMap: Record<string, string> = {};
  for (const item of skillsData) {
    const s = await prisma.skill.create({ data: item });
    skillMap[s.name] = s.id;
  }

  // Create Student Skills
  const studentSkills = [
    { skillName: 'Java', proficiency: 'Intermediate' },
    { skillName: 'SQL', proficiency: 'Intermediate' },
    { skillName: 'React', proficiency: 'Beginner' },
    { skillName: 'HTML', proficiency: 'Advanced' },
    { skillName: 'CSS', proficiency: 'Intermediate' },
    { skillName: 'JavaScript', proficiency: 'Intermediate' },
    { skillName: 'Git', proficiency: 'Intermediate' },
    { skillName: 'Communication', proficiency: 'Advanced' },
  ];

  for (const sk of studentSkills) {
    await prisma.studentSkill.create({
      data: {
        studentId: student.id,
        skillId: skillMap[sk.skillName],
        proficiency: sk.proficiency,
      },
    });
  }

  // Create Career Paths
  const careerPaths = [
    {
      title: 'Software Developer',
      description: 'Designs, develops, tests, and maintains software applications. Focuses on core logic, algorithms, and application delivery.',
      averageSalary: '$95,000 - $130,000',
      demandLevel: 'High',
      skills: ['Java', 'Python', 'SQL', 'Git'],
    },
    {
      title: 'Backend Developer',
      description: 'Responsible for server-side logic, database interactions, API integrations, and system scalability.',
      averageSalary: '$100,000 - $140,000',
      demandLevel: 'High',
      skills: ['Node.js', 'Express', 'SQL', 'Docker', 'Redis', 'Git'],
    },
    {
      title: 'Frontend Developer',
      description: 'Creates client-side UI components, ensures excellent UX, responsive layouts, and builds interactive interfaces.',
      averageSalary: '$85,000 - $120,000',
      demandLevel: 'High',
      skills: ['React', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Figma'],
    },
    {
      title: 'Full Stack Developer',
      description: 'Handles both client-side frontend and server-side backend logic, databases, and continuous delivery.',
      averageSalary: '$105,000 - $150,000',
      demandLevel: 'High',
      skills: ['React', 'Node.js', 'Express', 'TypeScript', 'SQL', 'Git'],
    },
    {
      title: 'Data Analyst',
      description: 'Collects, processes, and performs statistical analyses of data to help companies make informed business decisions.',
      averageSalary: '$70,000 - $95,000',
      demandLevel: 'Medium',
      skills: ['Python', 'SQL', 'Pandas', 'NumPy', 'Communication'],
    },
    {
      title: 'Data Scientist',
      description: 'Uses advanced math, statistics, and machine learning models to analyze complex datasets and solve strategic problems.',
      averageSalary: '$110,000 - $160,000',
      demandLevel: 'High',
      skills: ['Python', 'SQL', 'Pandas', 'NumPy', 'Scikit-Learn', 'PyTorch'],
    },
    {
      title: 'AI/ML Engineer',
      description: 'Specializes in training, building, deploying, and optimizing machine learning models for production systems.',
      averageSalary: '$120,000 - $175,000',
      demandLevel: 'High',
      skills: ['Python', 'PyTorch', 'TensorFlow', 'NumPy', 'Scikit-Learn'],
    },
    {
      title: 'Cloud Engineer',
      description: 'Architects, secures, configures, and manages cloud infrastructure, continuous deployment, and server scale.',
      averageSalary: '$115,000 - $155,000',
      demandLevel: 'High',
      skills: ['AWS', 'Docker', 'Kubernetes', 'Git'],
    },
  ];

  for (const cp of careerPaths) {
    const createdCp = await prisma.careerPath.create({
      data: {
        title: cp.title,
        description: cp.description,
        averageSalary: cp.averageSalary,
        demandLevel: cp.demandLevel,
      },
    });

    for (const skillName of cp.skills) {
      await prisma.careerPathSkill.create({
        data: {
          careerPathId: createdCp.id,
          skillId: skillMap[skillName],
        },
      });
    }
  }

  // Create Learning Resources
  const learningResources = [
    { skillName: 'Java', title: 'Java Programming Masterclass', url: 'https://coursera.org/learn/java-introduction', type: 'Course', duration: '30 hours', provider: 'Coursera' },
    { skillName: 'SQL', title: 'Complete SQL Bootcamp', url: 'https://udemy.com/course/the-complete-sql-bootcamp', type: 'Course', duration: '12 hours', provider: 'Udemy' },
    { skillName: 'React', title: 'React 18 & Redux Course', url: 'https://udemy.com/course/react-redux', type: 'Course', duration: '40 hours', provider: 'Udemy' },
    { skillName: 'Git', title: 'Git & GitHub Complete Guide', url: 'https://youtube.com/git-tutorial', type: 'Video', duration: '4 hours', provider: 'YouTube' },
    { skillName: 'TypeScript', title: 'Understanding TypeScript', url: 'https://udemy.com/course/understanding-typescript', type: 'Course', duration: '15 hours', provider: 'Udemy' },
    { skillName: 'Node.js', title: 'Node.js, Express & MongoDB Developer Course', url: 'https://udemy.com/course/the-complete-nodejs-developer-course-2', type: 'Course', duration: '35 hours', provider: 'Udemy' },
    { skillName: 'Express', title: 'REST APIs with Express', url: 'https://youtube.com/express-rest-api', type: 'Video', duration: '2 hours', provider: 'YouTube' },
    { skillName: 'Docker', title: 'Docker for Beginners', url: 'https://coursera.org/learn/docker-basics', type: 'Course', duration: '8 hours', provider: 'Coursera' },
    { skillName: 'Kubernetes', title: 'Kubernetes Certified Administrator Course', url: 'https://udemy.com/course/certified-kubernetes-administrator-with-practice-tests', type: 'Course', duration: '22 hours', provider: 'Udemy' },
    { skillName: 'AWS', title: 'AWS Certified Solutions Architect Associate', url: 'https://udemy.com/course/aws-certified-solutions-architect-associate-saa-c03', type: 'Course', duration: '27 hours', provider: 'Udemy' },
    { skillName: 'Python', title: 'Python for Everybody Specialization', url: 'https://coursera.org/specializations/python', type: 'Course', duration: '48 hours', provider: 'Coursera' },
    { skillName: 'Pandas', title: 'Data Analysis with Pandas', url: 'https://youtube.com/pandas-data-science', type: 'Video', duration: '6 hours', provider: 'YouTube' },
    { skillName: 'PyTorch', title: 'Deep Learning with PyTorch', url: 'https://pytorch.org/tutorials', type: 'Article', duration: '10 hours', provider: 'PyTorch' },
    { skillName: 'Figma', title: 'Figma UI/UX Design Essentials', url: 'https://udemy.com/course/figma-ux-ui-design-user-experience-tutorial', type: 'Course', duration: '10 hours', provider: 'Udemy' },
  ];

  for (const lr of learningResources) {
    if (skillMap[lr.skillName]) {
      await prisma.learningResource.create({
        data: {
          skillId: skillMap[lr.skillName],
          title: lr.title,
          url: lr.url,
          type: lr.type,
          duration: lr.duration,
          provider: lr.provider,
        },
      });
    }
  }

  // Create Opportunities
  const opportunities = [
    {
      title: 'Software Developer Intern',
      organization: 'TechNova Solutions',
      description: 'Join our software team to help build high-scale web platforms. You will work on creating REST API endpoints, designing backend logic, and collaborating with frontend teams.',
      type: 'Internship',
      location: 'San Francisco, CA',
      duration: '3 months',
      experienceLevel: 'Entry',
      workType: 'Remote',
      requiredSkills: ['Java', 'SQL', 'Git'],
      preferredSkills: ['React', 'Express'],
    },
    {
      title: 'Data Analyst Intern',
      organization: 'Insight Analytics',
      description: 'Looking for a data enthusiast to help parse big datasets, create internal dashboards, and write database queries to support product launch tracking.',
      type: 'Internship',
      location: 'New York, NY',
      duration: '6 months',
      experienceLevel: 'Entry',
      workType: 'Hybrid',
      requiredSkills: ['Python', 'SQL', 'Pandas'],
      preferredSkills: ['Communication', 'NumPy'],
    },
    {
      title: 'Frontend Developer Intern',
      organization: 'PixelCraft Studio',
      description: 'Help build user interfaces for dynamic web apps. You should have a strong design eye and understand state management in modern frontend libraries.',
      type: 'Internship',
      location: 'Austin, TX',
      duration: '4 months',
      experienceLevel: 'Entry',
      workType: 'Hybrid',
      requiredSkills: ['React', 'JavaScript', 'HTML', 'CSS'],
      preferredSkills: ['Figma', 'TypeScript'],
    },
    {
      title: 'Backend Developer Intern',
      organization: 'ScaleGrid Systems',
      description: 'Work on building highly scalable backend database services. Optimize slow SQL queries and implement caching policies.',
      type: 'Internship',
      location: 'Seattle, WA',
      duration: '3 months',
      experienceLevel: 'Entry',
      workType: 'Remote',
      requiredSkills: ['Node.js', 'Express', 'SQL'],
      preferredSkills: ['Docker', 'TypeScript', 'Redis'],
    },
    {
      title: 'AI/ML Project',
      organization: 'FutureLabs Research',
      description: 'Research project focusing on fine-tuning vision transformers and convolutional neural networks for semantic image search engines.',
      type: 'Project',
      location: 'Remote',
      duration: '2 months',
      experienceLevel: 'Intermediate',
      workType: 'Remote',
      requiredSkills: ['Python', 'PyTorch'],
      preferredSkills: ['Pandas', 'NumPy', 'Scikit-Learn'],
    },
    {
      title: 'Full Stack Developer',
      organization: 'CloudNest Technology',
      description: 'Responsible for our main SaaS customer web application. Implement complete end-to-end features from DB migration to CSS layout styling.',
      type: 'Job',
      location: 'Chicago, IL',
      duration: 'Full-time',
      experienceLevel: 'Advanced',
      workType: 'Onsite',
      requiredSkills: ['React', 'Node.js', 'Express', 'TypeScript', 'SQL', 'Git'],
      preferredSkills: ['AWS', 'Docker', 'Redis'],
    },
    {
      title: 'Cloud Engineering Intern',
      organization: 'WebScale Corp',
      description: 'Work with the DevOps team to implement infrastructure as code and configure Docker containers for development databases.',
      type: 'Internship',
      location: 'San Jose, CA',
      duration: '6 months',
      experienceLevel: 'Entry',
      workType: 'Remote',
      requiredSkills: ['AWS', 'Docker', 'Git'],
      preferredSkills: ['Kubernetes', 'TypeScript'],
    },
    {
      title: 'Data Science Internship',
      organization: 'QuantAI Capital',
      description: 'Analyze trading datasets, run statistics, build predictive machine learning models, and report results to risk teams.',
      type: 'Internship',
      location: 'Boston, MA',
      duration: '6 months',
      experienceLevel: 'Entry',
      workType: 'Hybrid',
      requiredSkills: ['Python', 'SQL', 'TensorFlow'],
      preferredSkills: ['Pandas', 'NumPy', 'Communication'],
    },
  ];

  for (const opp of opportunities) {
    const createdOpp = await prisma.opportunity.create({
      data: {
        title: opp.title,
        organization: opp.organization,
        description: opp.description,
        type: opp.type,
        location: opp.location,
        duration: opp.duration,
        experienceLevel: opp.experienceLevel,
        workType: opp.workType,
      },
    });

    for (const reqSkill of opp.requiredSkills) {
      if (skillMap[reqSkill]) {
        await prisma.opportunitySkill.create({
          data: {
            opportunityId: createdOpp.id,
            skillId: skillMap[reqSkill],
            isRequired: true,
          },
        });
      }
    }

    for (const prefSkill of opp.preferredSkills) {
      if (skillMap[prefSkill]) {
        await prisma.opportunitySkill.create({
          data: {
            opportunityId: createdOpp.id,
            skillId: skillMap[prefSkill],
            isRequired: false,
          },
        });
      }
    }
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
