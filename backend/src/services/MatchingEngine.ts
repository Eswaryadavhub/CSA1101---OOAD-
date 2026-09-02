export interface StudentSkillData {
  name: string;
  category: string;
  proficiency: string; // "Beginner", "Intermediate", "Advanced", "Expert"
}

export interface StudentProfileData {
  degree: string | null;
  department: string | null;
  experienceLevel: string | null;
  interests: string | null;
  preferredRole: string | null;
  preferredIndustry: string | null;
  preferredLocation: string | null;
  workType: string | null;
  skills: StudentSkillData[];
}

export interface OpportunitySkillData {
  name: string;
  category: string;
  isRequired: boolean;
}

export interface OpportunityData {
  id: string;
  title: string;
  organization: string;
  description: string;
  type: string;
  location: string;
  duration: string;
  experienceLevel: string;
  workType: string;
  skills: OpportunitySkillData[];
}

export interface MatchResultDetails {
  score: number;
  breakdown: {
    skillScore: number;
    educationScore: number;
    experienceScore: number;
    interestScore: number;
    careerScore: number;
  };
  matchedSkills: string[];
  missingSkills: { name: string; priority: 'High' | 'Medium' | 'Low' }[];
  explanations: string[];
}

export const PROFICIENCY_MULTIPLIERS: Record<string, number> = {
  'Beginner': 0.3,
  'Intermediate': 0.6,
  'Advanced': 0.85,
  'Expert': 1.0,
};

export class MatchingEngine {
  public static calculateMatch(student: StudentProfileData, opportunity: OpportunityData): MatchResultDetails {
    const explanations: string[] = [];
    
    // ----------------------------------------------------
    // 1. Skill Match (50% of total score)
    // ----------------------------------------------------
    const reqSkills = opportunity.skills.filter(s => s.isRequired);
    const prefSkills = opportunity.skills.filter(s => !s.isRequired);
    
    let reqScore = 0;
    let prefScore = 0;
    const matchedSkills: string[] = [];
    const missingSkills: { name: string; priority: 'High' | 'Medium' | 'Low' }[] = [];

    // Required skills matching
    if (reqSkills.length > 0) {
      let sumReq = 0;
      reqSkills.forEach(req => {
        const studentSkill = student.skills.find(s => s.name.toLowerCase() === req.name.toLowerCase());
        if (studentSkill) {
          matchedSkills.push(req.name);
          const mult = PROFICIENCY_MULTIPLIERS[studentSkill.proficiency] || 0.5;
          sumReq += mult;
        } else {
          missingSkills.push({ name: req.name, priority: 'High' });
        }
      });
      reqScore = sumReq / reqSkills.length;
      explanations.push(`Skills: You possess ${matchedSkills.length} out of ${reqSkills.length} required skills (${reqSkills.map(s => s.name).join(', ')}).`);
    } else {
      reqScore = 1.0;
      explanations.push('Skills: No required skills specified for this opportunity.');
    }

    // Preferred skills matching
    const matchedPref: string[] = [];
    if (prefSkills.length > 0) {
      let sumPref = 0;
      prefSkills.forEach(pref => {
        const studentSkill = student.skills.find(s => s.name.toLowerCase() === pref.name.toLowerCase());
        if (studentSkill) {
          matchedPref.push(pref.name);
          matchedSkills.push(pref.name);
          const mult = PROFICIENCY_MULTIPLIERS[studentSkill.proficiency] || 0.5;
          sumPref += mult;
        } else {
          missingSkills.push({ name: pref.name, priority: 'Medium' });
        }
      });
      prefScore = sumPref / prefSkills.length;
      if (matchedPref.length > 0) {
        explanations.push(`Skills: You matched preferred skills: ${matchedPref.join(', ')}.`);
      }
    } else {
      prefScore = 1.0;
    }

    // Weighted skill score
    const skillScoreRaw = reqSkills.length > 0 && prefSkills.length > 0
      ? (reqScore * 0.8 + prefScore * 0.2)
      : (reqSkills.length > 0 ? reqScore : prefScore);

    const skillScore = Math.round(skillScoreRaw * 50);

    // ----------------------------------------------------
    // 2. Education Compatibility (15% of total score)
    // ----------------------------------------------------
    let educationScore = 0;
    if (student.degree || student.department) {
      const dept = (student.department || '').toLowerCase();
      const deg = (student.degree || '').toLowerCase();
      const oppTitle = opportunity.title.toLowerCase();
      const oppDesc = opportunity.description.toLowerCase();

      let matched = false;
      if (
        dept.includes('computer') || dept.includes('software') || dept.includes('it') ||
        dept.includes('information') || dept.includes('data') || dept.includes('science') ||
        dept.includes('engineering') || dept.includes('mathematics') || dept.includes('statistics')
      ) {
        matched = true;
      }

      if (matched) {
        educationScore = 15;
        explanations.push(`Education: Your background in ${student.department || 'STEM'} is highly compatible with this technical role.`);
      } else {
        educationScore = 8; // partial baseline
        explanations.push(`Education: Your education background offers general compatibility.`);
      }
    } else {
      educationScore = 5;
      explanations.push('Education: Add your degree and department to improve education matching.');
    }

    // ----------------------------------------------------
    // 3. Experience Compatibility (10% of total score)
    // ----------------------------------------------------
    let experienceScore = 0;
    const studentExp = student.experienceLevel || 'Entry';
    const oppExp = opportunity.experienceLevel;

    if (studentExp === oppExp) {
      experienceScore = 10;
      explanations.push(`Experience: Perfect experience level match (${studentExp} level).`);
    } else if (
      (studentExp === 'Expert' || studentExp === 'Advanced') && 
      (oppExp === 'Entry' || oppExp === 'Intermediate')
    ) {
      experienceScore = 10;
      explanations.push(`Experience: Your experience level (${studentExp}) exceeds or meets the required level (${oppExp}).`);
    } else if (studentExp === 'Intermediate' && oppExp === 'Entry') {
      experienceScore = 10;
      explanations.push(`Experience: Your experience level (${studentExp}) exceeds the entry-level requirement.`);
    } else {
      // Underqualified
      if (studentExp === 'Entry' && oppExp === 'Advanced') {
        experienceScore = 3;
        explanations.push(`Experience: The opportunity requires Advanced experience, but your profile is at Entry level.`);
      } else {
        experienceScore = 6;
        explanations.push(`Experience: The opportunity requires ${oppExp} experience, but your profile is at ${studentExp} level.`);
      }
    }

    // ----------------------------------------------------
    // 4. Interests Compatibility (10% of total score)
    // ----------------------------------------------------
    let interestScore = 0;
    const interests = student.interests ? student.interests.split(',').map(i => i.trim().toLowerCase()) : [];
    
    if (interests.length > 0) {
      let matchedInterestsCount = 0;
      const oppText = `${opportunity.title} ${opportunity.description}`.toLowerCase();
      
      interests.forEach(interest => {
        if (oppText.includes(interest) || 
            (interest === 'ai/ml' && (oppText.includes('ai') || oppText.includes('ml') || oppText.includes('machine learning') || oppText.includes('deep learning'))) ||
            (interest === 'software development' && (oppText.includes('software') || oppText.includes('developer') || oppText.includes('programming'))) ||
            (interest === 'web development' && (oppText.includes('frontend') || oppText.includes('backend') || oppText.includes('web') || oppText.includes('full stack') || oppText.includes('react') || oppText.includes('html'))) ||
            (interest === 'data science' && (oppText.includes('data') || oppText.includes('analyst') || oppText.includes('analytics') || oppText.includes('pandas')))
        ) {
          matchedInterestsCount++;
        }
      });

      if (matchedInterestsCount > 0) {
        interestScore = Math.min(10, 5 + matchedInterestsCount * 2.5);
        explanations.push(`Interests: Aligns with your interests in ${interests.filter(i => {
          const oppText = `${opportunity.title} ${opportunity.description}`.toLowerCase();
          return oppText.includes(i) || (i === 'ai/ml' && (oppText.includes('ai') || oppText.includes('ml'))) || (i === 'software development' && oppText.includes('software')) || (i === 'web development' && oppText.includes('web'));
        }).join(', ')}.`);
      } else {
        interestScore = 3;
        explanations.push(`Interests: General interest match (limited direct alignment with your selected interest areas).`);
      }
    } else {
      interestScore = 2;
      explanations.push('Interests: Complete your profile interests to receive interest compatibility points.');
    }

    // ----------------------------------------------------
    // 5. Career Preferences Compatibility (15% of total score)
    // ----------------------------------------------------
    let careerScore = 0;
    let prefMatchesCount = 0;

    // Preferred Role matching
    if (student.preferredRole) {
      const prefRole = student.preferredRole.toLowerCase();
      const oppTitle = opportunity.title.toLowerCase();
      if (oppTitle.includes(prefRole) || prefRole.includes(oppTitle) || 
          (prefRole === 'software developer' && (oppTitle.includes('developer') || oppTitle.includes('engineer'))) ||
          (prefRole === 'backend developer' && oppTitle.includes('backend')) ||
          (prefRole === 'frontend developer' && oppTitle.includes('frontend')) ||
          (prefRole === 'full stack developer' && oppTitle.includes('full stack')) ||
          (prefRole === 'data scientist' && oppTitle.includes('data science')) ||
          (prefRole === 'data analyst' && oppTitle.includes('data analyst')) ||
          (prefRole === 'ai/ml engineer' && (oppTitle.includes('ai') || oppTitle.includes('ml') || oppTitle.includes('machine learning')))
      ) {
        prefMatchesCount += 2.5; // Role match weight
      }
    }

    // Preferred Location matching
    if (student.preferredLocation && (opportunity.location.toLowerCase().includes(student.preferredLocation.toLowerCase()) || student.preferredLocation.toLowerCase().includes('remote') && opportunity.workType.toLowerCase() === 'remote')) {
      prefMatchesCount += 2.5;
    } else if (student.preferredLocation && student.preferredLocation.toLowerCase().includes('remote') && opportunity.location.toLowerCase() === 'remote') {
      prefMatchesCount += 2.5;
    }

    // Preferred WorkType matching
    if (student.workType && opportunity.workType && student.workType.toLowerCase() === opportunity.workType.toLowerCase()) {
      prefMatchesCount += 2.5;
    }

    // Preferred Industry matching
    if (student.preferredIndustry) {
      const prefInd = student.preferredIndustry.toLowerCase();
      const oppDesc = opportunity.description.toLowerCase();
      const oppOrg = opportunity.organization.toLowerCase();
      if (oppDesc.includes(prefInd) || oppOrg.includes(prefInd) || prefInd === 'technology') {
        prefMatchesCount += 2.5;
      }
    }

    // Add extra baseline if some matches exist
    careerScore = Math.round(prefMatchesCount > 0 ? (prefMatchesCount / 10) * 15 : 4);
    if (prefMatchesCount >= 7.5) {
      explanations.push(`Preferences: High preference alignment for location, work style, or desired role.`);
    } else if (prefMatchesCount > 0) {
      explanations.push(`Preferences: Partial preference alignment with your preferred career settings.`);
    } else {
      explanations.push(`Preferences: Limited direct match with your location or role preferences.`);
    }

    // Compute total score
    const totalScore = Math.min(100, Math.max(0, skillScore + educationScore + experienceScore + interestScore + careerScore));

    return {
      score: totalScore,
      breakdown: {
        skillScore,
        educationScore,
        experienceScore,
        interestScore,
        careerScore
      },
      matchedSkills,
      missingSkills,
      explanations
    };
  }
}
