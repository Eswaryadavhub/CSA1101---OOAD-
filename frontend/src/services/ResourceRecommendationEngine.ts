export interface LearningResourceItem {
  id: string;
  title: string;
  skill: string;
  description: string;
  whyRecommended: string;
  priority: 'High Priority' | 'Medium Priority' | 'Low Priority';
  source: 'YouTube' | 'freeCodeCamp' | 'Official Documentation' | 'Coursera' | 'MDN Web Docs' | 'AWS Training' | 'Google Developers' | 'Microsoft Learn' | 'GitHub';
  resourceType: 'Video Course' | 'Interactive Tutorial' | 'Documentation' | 'Certification Guide' | 'Comprehensive Walkthrough';
  url: string;
  duration: string;
  actionText: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface RecommendationEngineInputs {
  resumeProfile?: any;
  studentProfile?: any;
  currentSkills: { name: string; category?: string; proficiency?: string }[];
  opportunities: any[];
  careerPaths?: any[];
}

// Comprehensive database of real, verified educational resources with direct URLs
export const CURATED_RESOURCE_DATABASE: Record<string, Omit<LearningResourceItem, 'id' | 'whyRecommended' | 'priority'>[]> = {
  'Node.js': [
    {
      title: 'Node.js and Express.js - Full Course for Beginners',
      skill: 'Node.js',
      description: 'Master asynchronous JavaScript, Express routing, REST architecture, middleware, and backend API production development.',
      source: 'YouTube',
      resourceType: 'Video Course',
      url: 'https://www.youtube.com/watch?v=Oe421EPjeBE',
      duration: '8 hours',
      actionText: 'Watch on YouTube',
      level: 'Beginner',
    },
    {
      title: 'Node.js Official Documentation & Guides',
      skill: 'Node.js',
      description: 'The definitive official documentation covering the Node.js runtime, event loop, file system, streams, and cluster modules.',
      source: 'Official Documentation',
      resourceType: 'Documentation',
      url: 'https://nodejs.org/docs/latest/api/',
      duration: 'Self-paced',
      actionText: 'Read Documentation',
      level: 'Intermediate',
    },
    {
      title: 'Back End Development and APIs Certification',
      skill: 'Node.js',
      description: 'Interactive curriculum building microservices and back-end applications using Node.js, Express, and npm packages.',
      source: 'freeCodeCamp',
      resourceType: 'Interactive Tutorial',
      url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/',
      duration: '30 hours',
      actionText: 'Learn on freeCodeCamp',
      level: 'Beginner',
    },
  ],

  'Express': [
    {
      title: 'Express.js Crash Course & RESTful APIs',
      skill: 'Express',
      description: 'Fast-paced walkthrough building a REST API with routing, HTTP methods, headers, middleware, and request handling.',
      source: 'YouTube',
      resourceType: 'Video Course',
      url: 'https://www.youtube.com/watch?v=SccSCuHhOw0',
      duration: '1.5 hours',
      actionText: 'Watch on YouTube',
      level: 'Beginner',
    },
    {
      title: 'Express.js Official Getting Started Guide',
      skill: 'Express',
      description: 'Official guide on routing, middleware writing, template engines, and production best practices.',
      source: 'Official Documentation',
      resourceType: 'Documentation',
      url: 'https://expressjs.com/en/starter/installing.html',
      duration: 'Self-paced',
      actionText: 'Read Documentation',
      level: 'Intermediate',
    },
  ],

  'Docker': [
    {
      title: 'Docker Tutorial for Beginners - Hands-On Containers',
      skill: 'Docker',
      description: 'Understand containerization, Dockerfiles, images, containers, volumes, port mapping, and docker-compose for multi-service apps.',
      source: 'YouTube',
      resourceType: 'Video Course',
      url: 'https://www.youtube.com/watch?v=fqMOX6JJhGo',
      duration: '2.5 hours',
      actionText: 'Watch on YouTube',
      level: 'Beginner',
    },
    {
      title: 'The Docker Handbook - Complete Guide for Developers',
      skill: 'Docker',
      description: 'Step-by-step practical handbook on Docker CLI commands, networking, layer caching, and deployment.',
      source: 'freeCodeCamp',
      resourceType: 'Comprehensive Walkthrough',
      url: 'https://www.freecodecamp.org/news/the-docker-handbook/',
      duration: '6 hours',
      actionText: 'Read on freeCodeCamp',
      level: 'Intermediate',
    },
    {
      title: 'Docker Official Getting Started Documentation',
      skill: 'Docker',
      description: 'Official tutorial walking through building, sharing, and running containerized applications.',
      source: 'Official Documentation',
      resourceType: 'Documentation',
      url: 'https://docs.docker.com/get-started/',
      duration: 'Self-paced',
      actionText: 'Read Documentation',
      level: 'Beginner',
    },
  ],

  'MongoDB': [
    {
      title: 'MongoDB Crash Course - NoSQL Document Database',
      skill: 'MongoDB',
      description: 'Learn MongoDB document storage, schemas with Mongoose, aggregation pipelines, and integration with Node.js apps.',
      source: 'YouTube',
      resourceType: 'Video Course',
      url: 'https://www.youtube.com/watch?v=ofme2o29ngU',
      duration: '1.5 hours',
      actionText: 'Watch on YouTube',
      level: 'Beginner',
    },
    {
      title: 'MongoDB for Beginners - Complete Database Guide',
      skill: 'MongoDB',
      description: 'Deep dive into MongoDB Atlas cloud clusters, indexes, replication, and query performance optimization.',
      source: 'freeCodeCamp',
      resourceType: 'Comprehensive Walkthrough',
      url: 'https://www.freecodecamp.org/news/learn-mongodb-a4ce205e7739/',
      duration: '5 hours',
      actionText: 'Read on freeCodeCamp',
      level: 'Intermediate',
    },
    {
      title: 'MongoDB Official Manual & CRUD Operations',
      skill: 'MongoDB',
      description: 'Official reference covering database commands, security, query syntax, and connection drivers.',
      source: 'Official Documentation',
      resourceType: 'Documentation',
      url: 'https://www.mongodb.com/docs/manual/tutorial/getting-started/',
      duration: 'Self-paced',
      actionText: 'Read Documentation',
      level: 'Intermediate',
    },
  ],

  'AWS': [
    {
      title: 'AWS Cloud Practitioner Essentials - Official Course',
      skill: 'AWS',
      description: 'Official fundamentals training on cloud computing concepts, AWS security, architecture, compute (EC2), and storage (S3).',
      source: 'AWS Training',
      resourceType: 'Certification Guide',
      url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/134/aws-cloud-practitioner-essentials',
      duration: '6 hours',
      actionText: 'Start on AWS Skill Builder',
      level: 'Beginner',
    },
    {
      title: 'AWS Certified Cloud Practitioner Full Course',
      skill: 'AWS',
      description: 'Thorough video course covering IAM, VPC, RDS, Lambda serverless, and cloud billing with practice scenarios.',
      source: 'YouTube',
      resourceType: 'Video Course',
      url: 'https://www.youtube.com/watch?v=ulprqHHWlng',
      duration: '14 hours',
      actionText: 'Watch on YouTube',
      level: 'Beginner',
    },
    {
      title: 'Amazon Web Services Official Architecture Center',
      skill: 'AWS',
      description: 'Reference architectures, whitepapers, and guides for deploying resilient cloud-native applications.',
      source: 'Official Documentation',
      resourceType: 'Documentation',
      url: 'https://docs.aws.amazon.com/',
      duration: 'Self-paced',
      actionText: 'Read Documentation',
      level: 'Intermediate',
    },
  ],

  'Kubernetes': [
    {
      title: 'Kubernetes Course for Beginners - Container Orchestration',
      skill: 'Kubernetes',
      description: 'Learn pods, replica sets, deployments, services, ingress controllers, and config maps from scratch.',
      source: 'YouTube',
      resourceType: 'Video Course',
      url: 'https://www.youtube.com/watch?v=X48VuDVv0do',
      duration: '4 hours',
      actionText: 'Watch on YouTube',
      level: 'Intermediate',
    },
    {
      title: 'The Kubernetes Handbook - Architecture & Pods',
      skill: 'Kubernetes',
      description: 'Comprehensive guide explaining production cluster management, declarative YAML configurations, and scaling.',
      source: 'freeCodeCamp',
      resourceType: 'Comprehensive Walkthrough',
      url: 'https://www.freecodecamp.org/news/the-kubernetes-handbook/',
      duration: '8 hours',
      actionText: 'Read on freeCodeCamp',
      level: 'Intermediate',
    },
    {
      title: 'Kubernetes Basics Official Interactive Tutorials',
      skill: 'Kubernetes',
      description: 'Interactive browser terminals demonstrating cluster deployments, pod inspection, and service exposure.',
      source: 'Official Documentation',
      resourceType: 'Interactive Tutorial',
      url: 'https://kubernetes.io/docs/tutorials/kubernetes-basics/',
      duration: '3 hours',
      actionText: 'Try Interactive Tutorials',
      level: 'Intermediate',
    },
  ],

  'Redis': [
    {
      title: 'Redis Crash Course - In-Memory Caching & Key-Value Store',
      skill: 'Redis',
      description: 'Learn strings, lists, sets, hashes, pub/sub channels, and how to cache expensive database queries.',
      source: 'YouTube',
      resourceType: 'Video Course',
      url: 'https://www.youtube.com/watch?v=jgpVdJB2sKQ',
      duration: '1 hour',
      actionText: 'Watch on YouTube',
      level: 'Intermediate',
    },
    {
      title: 'Redis Official Quickstart & Architecture Guides',
      skill: 'Redis',
      description: 'Official guides covering installation, Redis data structures, persistence (RDB/AOF), and clustering.',
      source: 'Official Documentation',
      resourceType: 'Documentation',
      url: 'https://redis.io/docs/latest/get-started/',
      duration: 'Self-paced',
      actionText: 'Read Documentation',
      level: 'Intermediate',
    },
  ],

  'TypeScript': [
    {
      title: 'TypeScript Full Course for Beginners',
      skill: 'TypeScript',
      description: 'Master strict typing, interfaces, generics, union types, enums, type guards, and TSConfig configuration.',
      source: 'YouTube',
      resourceType: 'Video Course',
      url: 'https://www.youtube.com/watch?v=BwuLxPH8IDs',
      duration: '5 hours',
      actionText: 'Watch on YouTube',
      level: 'Beginner',
    },
    {
      title: 'The TypeScript Handbook - Official Guide',
      skill: 'TypeScript',
      description: 'Official comprehensive manual explaining the type system, narrowing, utility types, and modules.',
      source: 'Official Documentation',
      resourceType: 'Documentation',
      url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
      duration: 'Self-paced',
      actionText: 'Read Documentation',
      level: 'Intermediate',
    },
  ],

  'Python': [
    {
      title: 'Python for Beginners - Full Course',
      skill: 'Python',
      description: 'Foundations of Python syntax, object-oriented programming, data structures, list comprehensions, and modules.',
      source: 'YouTube',
      resourceType: 'Video Course',
      url: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
      duration: '4.5 hours',
      actionText: 'Watch on YouTube',
      level: 'Beginner',
    },
    {
      title: 'Python for Everybody Specialization - University of Michigan',
      skill: 'Python',
      description: 'University specialization teaching data structures, networked application interfaces, and web scraping.',
      source: 'Coursera',
      resourceType: 'Certification Guide',
      url: 'https://www.coursera.org/specializations/python',
      duration: '40 hours',
      actionText: 'View on Coursera',
      level: 'Intermediate',
    },
    {
      title: 'The Python Tutorial - Official Documentation',
      skill: 'Python',
      description: 'The official tutorial by the Python Software Foundation covering Python standard library and features.',
      source: 'Official Documentation',
      resourceType: 'Documentation',
      url: 'https://docs.python.org/3/tutorial/',
      duration: 'Self-paced',
      actionText: 'Read Documentation',
      level: 'Beginner',
    },
  ],

  'Pandas': [
    {
      title: 'Pandas & Python for Data Analysis Full Course',
      skill: 'Pandas',
      description: 'Learn DataFrames, Series, filtering, grouping, aggregation, handling missing data, and merging datasets.',
      source: 'YouTube',
      resourceType: 'Video Course',
      url: 'https://www.youtube.com/watch?v=vmEHCJofslg',
      duration: '6 hours',
      actionText: 'Watch on YouTube',
      level: 'Beginner',
    },
    {
      title: 'Pandas Official 10-Minute Walkthrough & Reference',
      skill: 'Pandas',
      description: 'Official tutorial quickly introducing data selection, plotting, timeseries, and I/O operations.',
      source: 'Official Documentation',
      resourceType: 'Documentation',
      url: 'https://pandas.pydata.org/docs/getting_started/index.html',
      duration: 'Self-paced',
      actionText: 'Read Documentation',
      level: 'Intermediate',
    },
  ],

  'PyTorch': [
    {
      title: 'PyTorch for Deep Learning & Machine Learning - Full Course',
      skill: 'PyTorch',
      description: 'Build neural networks, loss functions, optimizers, computer vision models, and custom datasets in PyTorch.',
      source: 'YouTube',
      resourceType: 'Video Course',
      url: 'https://www.youtube.com/watch?v=V_xro1bcAuA',
      duration: '26 hours',
      actionText: 'Watch on YouTube',
      level: 'Intermediate',
    },
    {
      title: 'Learn the Basics - PyTorch Official Tutorials',
      skill: 'PyTorch',
      description: 'Official step-by-step documentation on Tensors, Autograd, Model Building, and GPU acceleration.',
      source: 'Official Documentation',
      resourceType: 'Documentation',
      url: 'https://pytorch.org/tutorials/beginner/basics/intro.html',
      duration: 'Self-paced',
      actionText: 'Read Documentation',
      level: 'Beginner',
    },
  ],

  'TensorFlow': [
    {
      title: 'TensorFlow Core Tutorials & Neural Network Quickstart',
      skill: 'TensorFlow',
      description: 'Official guides on Keras sequential models, loss optimization, convolutional neural nets, and model saving.',
      source: 'Google Developers',
      resourceType: 'Documentation',
      url: 'https://www.tensorflow.org/tutorials',
      duration: 'Self-paced',
      actionText: 'Read on TensorFlow.org',
      level: 'Intermediate',
    },
    {
      title: 'TensorFlow 2.0 Complete Course - Deep Learning',
      skill: 'TensorFlow',
      description: 'Comprehensive course covering regression, classification, CNNs for computer vision, and NLP models.',
      source: 'YouTube',
      resourceType: 'Video Course',
      url: 'https://www.youtube.com/watch?v=tPYj3fFJGjk',
      duration: '7 hours',
      actionText: 'Watch on YouTube',
      level: 'Beginner',
    },
  ],

  'React': [
    {
      title: 'React.dev - Official Quick Start & Core Concepts',
      skill: 'React',
      description: 'Modern official interactive documentation focusing on functional components, hooks, state, and unidirectional data flow.',
      source: 'Official Documentation',
      resourceType: 'Interactive Tutorial',
      url: 'https://react.dev/learn',
      duration: 'Self-paced',
      actionText: 'Read on React.dev',
      level: 'Beginner',
    },
    {
      title: 'React Course - Beginner\'s Tutorial for React 18',
      skill: 'React',
      description: 'Build real interactive web projects with hooks (useState, useEffect), conditional rendering, and component composition.',
      source: 'YouTube',
      resourceType: 'Video Course',
      url: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
      duration: '12 hours',
      actionText: 'Watch on YouTube',
      level: 'Beginner',
    },
    {
      title: 'Front End Development Libraries Certification',
      skill: 'React',
      description: 'Build frontend applications with React, Redux, Sass, and Bootstrap in freeCodeCamp\'s interactive lab.',
      source: 'freeCodeCamp',
      resourceType: 'Interactive Tutorial',
      url: 'https://www.freecodecamp.org/learn/front-end-development-libraries/',
      duration: '30 hours',
      actionText: 'Learn on freeCodeCamp',
      level: 'Intermediate',
    },
  ],

  'SQL': [
    {
      title: 'SQL Tutorial - Full Database Course for Beginners',
      skill: 'SQL',
      description: 'Comprehensive introduction to database schemas, queries, WHERE filters, GROUP BY, aggregations, and multi-table JOINs.',
      source: 'YouTube',
      resourceType: 'Video Course',
      url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
      duration: '4 hours',
      actionText: 'Watch on YouTube',
      level: 'Beginner',
    },
    {
      title: 'PostgreSQL Official Tutorial & Query Documentation',
      skill: 'SQL',
      description: 'Official PostgreSQL tutorial explaining relational database design, indexing, foreign keys, and transactions.',
      source: 'Official Documentation',
      resourceType: 'Documentation',
      url: 'https://www.postgresql.org/docs/current/tutorial.html',
      duration: 'Self-paced',
      actionText: 'Read Documentation',
      level: 'Intermediate',
    },
  ],

  'Java': [
    {
      title: 'Java Programming and Software Engineering Fundamentals',
      skill: 'Java',
      description: 'University-accredited course on object-oriented programming, classes, inheritance, polymorphism, and algorithms.',
      source: 'Coursera',
      resourceType: 'Certification Guide',
      url: 'https://www.coursera.org/specializations/java-programming',
      duration: '35 hours',
      actionText: 'View on Coursera',
      level: 'Intermediate',
    },
    {
      title: 'Building a RESTful Web Service with Spring Boot',
      skill: 'Java',
      description: 'Official hands-on guide to scaffolding enterprise microservices and dependency injection with Spring Boot.',
      source: 'Official Documentation',
      resourceType: 'Documentation',
      url: 'https://spring.io/guides/gs/rest-service/',
      duration: '1 hour',
      actionText: 'Read Guide',
      level: 'Advanced',
    },
  ],

  'Git': [
    {
      title: 'Git and GitHub for Beginners - Crash Course',
      skill: 'Git',
      description: 'Learn version control, commits, branching, merging, merge conflicts, pull requests, and GitHub remote workflows.',
      source: 'YouTube',
      resourceType: 'Video Course',
      url: 'https://www.youtube.com/watch?v=RGOj5yH7evk',
      duration: '1 hour',
      actionText: 'Watch on YouTube',
      level: 'Beginner',
    },
    {
      title: 'Pro Git Book & Official Reference Documentation',
      skill: 'Git',
      description: 'The complete official book on Git internals, plumbing commands, rebasing, and branching strategies.',
      source: 'Official Documentation',
      resourceType: 'Documentation',
      url: 'https://git-scm.com/doc',
      duration: 'Self-paced',
      actionText: 'Read Pro Git Book',
      level: 'Intermediate',
    },
  ],

  'Figma': [
    {
      title: 'Figma UI Design Tutorial: Get Started in 2024',
      skill: 'Figma',
      description: 'Learn wireframing, auto-layout, design systems, interactive components, and responsive prototyping in Figma.',
      source: 'YouTube',
      resourceType: 'Video Course',
      url: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8',
      duration: '2 hours',
      actionText: 'Watch on YouTube',
      level: 'Beginner',
    },
    {
      title: 'Figma Design Fundamentals Official Guide',
      skill: 'Figma',
      description: 'Official Figma documentation on vector networks, component variants, and design handoff to engineering.',
      source: 'Official Documentation',
      resourceType: 'Documentation',
      url: 'https://help.figma.com/hc/en-us/categories/360002051613-Figma-Design',
      duration: 'Self-paced',
      actionText: 'Read Documentation',
      level: 'Intermediate',
    },
  ],

  'System Design': [
    {
      title: 'The System Design Primer - Architecture & Scalability',
      skill: 'System Design',
      description: 'Industry-standard open-source guide to designing large-scale systems, load balancing, caching, and database sharding.',
      source: 'GitHub',
      resourceType: 'Comprehensive Walkthrough',
      url: 'https://github.com/donnemartin/system-design-primer',
      duration: 'Self-paced',
      actionText: 'Open on GitHub',
      level: 'Advanced',
    },
    {
      title: 'System Design Course for Beginners - freeCodeCamp',
      skill: 'System Design',
      description: 'Learn client-server architecture, microservices, CAP theorem, message queues (Kafka, RabbitMQ), and CDN networks.',
      source: 'YouTube',
      resourceType: 'Video Course',
      url: 'https://www.youtube.com/watch?v=bUHFg8CZFCA',
      duration: '2.5 hours',
      actionText: 'Watch on YouTube',
      level: 'Advanced',
    },
  ],
};

export class ResourceRecommendationEngine {
  /**
   * Generates a fully personalized learning path dynamically derived from:
   * 1. Resume detected skills & proficiencies
   * 2. Existing student registered skills
   * 3. Target opportunities & skill gaps
   * 4. Career direction and goals
   */
  public static generatePlan(inputs: RecommendationEngineInputs): LearningResourceItem[] {
    const { resumeProfile, studentProfile, currentSkills, opportunities } = inputs;

    // 1. Compile student's combined skill inventory with proficiencies
    const combinedSkillMap = new Map<string, { proficiency: string; source: 'resume' | 'manual' | 'both' }>();

    // Add manual skills
    (currentSkills || []).forEach(s => {
      const name = (s.name || '').trim();
      if (name) {
        combinedSkillMap.set(name.toLowerCase(), {
          proficiency: s.proficiency || 'Intermediate',
          source: 'manual',
        });
      }
    });

    // Add resume detected skills
    if (resumeProfile && Array.isArray(resumeProfile.detectedSkills)) {
      resumeProfile.detectedSkills.forEach((s: any) => {
        const name = (s.name || '').trim();
        if (name) {
          const lower = name.toLowerCase();
          const existing = combinedSkillMap.get(lower);
          if (existing) {
            // Upgrade if resume shows higher proficiency
            const profRank: Record<string, number> = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Expert': 4 };
            const existingRank = profRank[existing.proficiency] || 2;
            const newRank = profRank[s.proficiency] || 2;
            combinedSkillMap.set(lower, {
              proficiency: newRank > existingRank ? s.proficiency : existing.proficiency,
              source: 'both',
            });
          } else {
            combinedSkillMap.set(lower, {
              proficiency: s.proficiency || 'Intermediate',
              source: 'resume',
            });
          }
        }
      });
    }

    // 2. Identify target career goal / direction
    const targetCareer = resumeProfile?.careerDirection || studentProfile?.preferredRole || 'Full Stack Software Development';
    const resumeSkillsList = Array.from(combinedSkillMap.keys());

    // 3. Scan opportunities to detect high-frequency missing skills
    interface SkillGapData {
      name: string;
      requiredCount: number;
      preferredCount: number;
      neededByOppTitles: string[];
      priority: 'High Priority' | 'Medium Priority' | 'Low Priority';
    }

    const gapMap = new Map<string, SkillGapData>();

    (opportunities || []).forEach(opp => {
      const oppSkills = opp.skills || [];
      oppSkills.forEach((os: any) => {
        const skillName = os.skill?.name || os.name;
        if (!skillName) return;
        const lower = skillName.toLowerCase();
        const studentSkill = combinedSkillMap.get(lower);

        // Missing completely
        if (!studentSkill) {
          const current = gapMap.get(skillName) || {
            name: skillName,
            requiredCount: 0,
            preferredCount: 0,
            neededByOppTitles: [],
            priority: 'Medium Priority',
          };

          if (os.isRequired) {
            current.requiredCount++;
            current.priority = 'High Priority';
          } else {
            current.preferredCount++;
          }

          if (!current.neededByOppTitles.includes(opp.title)) {
            current.neededByOppTitles.push(opp.title);
          }

          gapMap.set(skillName, current);
        } else if (studentSkill.proficiency === 'Beginner' && os.isRequired) {
          // Student is only beginner, but opportunity requires it
          const current = gapMap.get(skillName) || {
            name: skillName,
            requiredCount: 0,
            preferredCount: 0,
            neededByOppTitles: [],
            priority: 'Medium Priority',
          };
          current.requiredCount++;
          if (!current.neededByOppTitles.includes(opp.title)) {
            current.neededByOppTitles.push(opp.title);
          }
          gapMap.set(skillName, current);
        }
      });
    });

    // 4. Rank gaps: High Priority (required by multiple opps) > Medium Priority > Low Priority
    const rankedGaps = Array.from(gapMap.values()).sort((a, b) => {
      if (a.priority === 'High Priority' && b.priority !== 'High Priority') return -1;
      if (b.priority === 'High Priority' && a.priority !== 'High Priority') return 1;
      return (b.requiredCount * 2 + b.preferredCount) - (a.requiredCount * 2 + a.preferredCount);
    });

    // 5. Generate learning recommendations
    const recommendations: LearningResourceItem[] = [];
    const usedSkillNames = new Set<string>();

    rankedGaps.forEach(gap => {
      const dbEntries = CURATED_RESOURCE_DATABASE[gap.name];
      if (dbEntries && dbEntries.length > 0 && !usedSkillNames.has(gap.name.toLowerCase())) {
        usedSkillNames.add(gap.name.toLowerCase());
        const selectedResource = dbEntries[0];

        // Craft a hyper-personalized whyRecommended explanation referencing resume and opportunities
        const oppCount = gap.neededByOppTitles.length;
        const oppSample = gap.neededByOppTitles.slice(0, 2).join(', ');
        
        let why = '';
        if (resumeProfile && resumeSkillsList.length > 0) {
          const knownSubset = resumeSkillsList.slice(0, 3).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ');
          if (gap.priority === 'High Priority') {
            why = `Your resume demonstrates proficiency in ${knownSubset}, but ${gap.name} is missing from your profile. It is a mandatory requirement for ${oppCount} of your top-matching opportunities (including ${oppSample}). Learning ${gap.name} will significantly elevate your compatibility score.`;
          } else {
            why = `Recommended for your ${targetCareer} track. Adding ${gap.name} builds on your existing knowledge of ${knownSubset} and meets preferred criteria across multiple active postings.`;
          }
        } else {
          why = `${gap.name} is required across ${oppCount} active opportunities in ${targetCareer} roles (including ${oppSample}). Mastering it will close a critical qualification gap.`;
        }

        recommendations.push({
          id: `rec_${gap.name.toLowerCase()}_${Date.now()}_${recommendations.length}`,
          title: selectedResource.title,
          skill: gap.name,
          description: selectedResource.description,
          whyRecommended: why,
          priority: gap.priority,
          source: selectedResource.source,
          resourceType: selectedResource.resourceType,
          url: selectedResource.url,
          duration: selectedResource.duration,
          actionText: selectedResource.actionText,
          level: selectedResource.level,
        });
      }
    });

    // If student has strong skills, offer advanced architecture/system design instead of beginner repetition
    const hasAdvancedDev = Array.from(combinedSkillMap.entries()).some(
      ([, data]) => data.proficiency === 'Advanced' || data.proficiency === 'Expert'
    );

    if (hasAdvancedDev && !usedSkillNames.has('system design')) {
      const sysDesign = CURATED_RESOURCE_DATABASE['System Design']?.[0];
      if (sysDesign) {
        recommendations.push({
          id: `rec_system_design_${Date.now()}`,
          title: sysDesign.title,
          skill: 'System Design',
          description: sysDesign.description,
          whyRecommended: `Your resume demonstrates advanced software engineering foundations. Industry leaders expect candidates at your level to master high-scale distributed architecture, caching, and database partitioning.`,
          priority: 'Medium Priority',
          source: sysDesign.source,
          resourceType: sysDesign.resourceType,
          url: sysDesign.url,
          duration: sysDesign.duration,
          actionText: sysDesign.actionText,
          level: 'Advanced',
        });
      }
    }

    // Ensure we always return at least 4-6 diverse high quality recommendations
    if (recommendations.length < 4) {
      const fallbackSkills = ['Docker', 'TypeScript', 'Node.js', 'AWS', 'Redis', 'SQL'];
      for (const fb of fallbackSkills) {
        if (!usedSkillNames.has(fb.toLowerCase()) && CURATED_RESOURCE_DATABASE[fb]) {
          usedSkillNames.add(fb.toLowerCase());
          const res = CURATED_RESOURCE_DATABASE[fb][0];
          recommendations.push({
            id: `rec_fallback_${fb.toLowerCase()}_${recommendations.length}`,
            title: res.title,
            skill: fb,
            description: res.description,
            whyRecommended: `Essential industry standard for modern ${targetCareer} roles. Highly prioritized to expand your technical adaptability.`,
            priority: 'Medium Priority',
            source: res.source,
            resourceType: res.resourceType,
            url: res.url,
            duration: res.duration,
            actionText: res.actionText,
            level: res.level,
          });
          if (recommendations.length >= 6) break;
        }
      }
    }

    return recommendations;
  }
}
