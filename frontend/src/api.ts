import { mockStore } from './mockStore';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const getHeaders = () => {
  const token = localStorage.getItem('skillmatch_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

async function handleResponse(res: Response) {
  if (!res.ok) {
    let errorMsg = 'An error occurred';
    try {
      const data = await res.json();
      errorMsg = data.message || errorMsg;
    } catch (e) {
      // Ignore parse error
    }
    throw new Error(errorMsg);
  }
  return res.json();
}

export const api = {
  // Auth
  async login(email: string, password: string) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return await handleResponse(res);
    } catch (err) {
      console.warn('Backend unavailable, falling back to local demo store:', err);
      return mockStore.login(email, password);
    }
  },

  // Profile
  async getProfile() {
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        headers: getHeaders(),
      });
      return await handleResponse(res);
    } catch (err) {
      return mockStore.getProfile();
    }
  },

  async updateProfile(profileData: any) {
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(profileData),
      });
      return await handleResponse(res);
    } catch (err) {
      return mockStore.updateProfile(profileData);
    }
  },

  // Skills
  async getSkills() {
    try {
      const res = await fetch(`${API_BASE}/skills`, {
        headers: getHeaders(),
      });
      return await handleResponse(res);
    } catch (err) {
      return mockStore.getSkills();
    }
  },

  async addSkill(skillData: { skillId?: string; skillName?: string; category?: string; proficiency: string }) {
    try {
      const res = await fetch(`${API_BASE}/skills`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(skillData),
      });
      return await handleResponse(res);
    } catch (err) {
      return mockStore.addSkill(skillData);
    }
  },

  async removeSkill(skillId: string) {
    try {
      const res = await fetch(`${API_BASE}/skills/skill/${skillId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return await handleResponse(res);
    } catch (err) {
      return mockStore.removeSkill(skillId);
    }
  },

  // Opportunities
  async getOpportunities(filters: { type?: string; search?: string; skill?: string } = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.search) params.append('search', filters.search);
      if (filters.skill) params.append('skill', filters.skill);

      const res = await fetch(`${API_BASE}/opportunities?${params.toString()}`, {
        headers: getHeaders(),
      });
      return await handleResponse(res);
    } catch (err) {
      return mockStore.getOpportunities(filters);
    }
  },

  async getOpportunityDetails(id: string) {
    try {
      const res = await fetch(`${API_BASE}/opportunities/${id}`, {
        headers: getHeaders(),
      });
      return await handleResponse(res);
    } catch (err) {
      return mockStore.getOpportunityDetails(id);
    }
  },

  // Saved Opportunities
  async getSavedOpportunities() {
    try {
      const res = await fetch(`${API_BASE}/saved-opportunities`, {
        headers: getHeaders(),
      });
      return await handleResponse(res);
    } catch (err) {
      return mockStore.getSavedOpportunities();
    }
  },

  async saveOpportunity(opportunityId: string) {
    try {
      const res = await fetch(`${API_BASE}/saved-opportunities`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ opportunityId }),
      });
      return await handleResponse(res);
    } catch (err) {
      return mockStore.saveOpportunity(opportunityId);
    }
  },

  async unsaveOpportunity(opportunityId: string) {
    try {
      const res = await fetch(`${API_BASE}/saved-opportunities/${opportunityId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return await handleResponse(res);
    } catch (err) {
      return mockStore.unsaveOpportunity(opportunityId);
    }
  },

  // Matches, Skill Gaps, Career Paths, Learning Plans
  async getMatches() {
    try {
      const res = await fetch(`${API_BASE}/matches`, {
        headers: getHeaders(),
      });
      return await handleResponse(res);
    } catch (err) {
      return mockStore.getMatches();
    }
  },

  async getSkillGaps() {
    try {
      const res = await fetch(`${API_BASE}/skill-gaps`, {
        headers: getHeaders(),
      });
      return await handleResponse(res);
    } catch (err) {
      return mockStore.getSkillGaps();
    }
  },

  async getCareerPaths() {
    try {
      const res = await fetch(`${API_BASE}/career-paths`, {
        headers: getHeaders(),
      });
      return await handleResponse(res);
    } catch (err) {
      return mockStore.getCareerPaths();
    }
  },

  async getLearningPath() {
    try {
      const res = await fetch(`${API_BASE}/learning-path`, {
        headers: getHeaders(),
      });
      return await handleResponse(res);
    } catch (err) {
      return mockStore.getLearningPath();
    }
  },

  // Applications
  async applyOpportunity(opportunityId: string) {
    try {
      const res = await fetch(`${API_BASE}/applications`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ opportunityId }),
      });
      return await handleResponse(res);
    } catch (err) {
      return mockStore.applyOpportunity(opportunityId);
    }
  },

  async getApplications() {
    try {
      const res = await fetch(`${API_BASE}/applications`, {
        headers: getHeaders(),
      });
      return await handleResponse(res);
    } catch (err) {
      return mockStore.getApplications();
    }
  },

  // Admin
  async getAdminStatistics() {
    try {
      const res = await fetch(`${API_BASE}/admin/statistics`, {
        headers: getHeaders(),
      });
      return await handleResponse(res);
    } catch (err) {
      return mockStore.getAdminStatistics();
    }
  },

  async getAdminStudents() {
    try {
      const res = await fetch(`${API_BASE}/admin/students`, {
        headers: getHeaders(),
      });
      return await handleResponse(res);
    } catch (err) {
      return mockStore.getAdminStudents();
    }
  },

  async createOpportunity(oppData: any) {
    try {
      const res = await fetch(`${API_BASE}/admin/opportunities`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(oppData),
      });
      return await handleResponse(res);
    } catch (err) {
      return mockStore.createOpportunity(oppData);
    }
  },

  async updateOpportunity(id: string, oppData: any) {
    try {
      const res = await fetch(`${API_BASE}/admin/opportunities/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(oppData),
      });
      return await handleResponse(res);
    } catch (err) {
      return mockStore.updateOpportunity(id, oppData);
    }
  },

  async deleteOpportunity(id: string) {
    try {
      const res = await fetch(`${API_BASE}/admin/opportunities/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return await handleResponse(res);
    } catch (err) {
      return mockStore.deleteOpportunity(id);
    }
  },

  // Resume Profile Management
  getResumeProfile() {
    return mockStore.getResumeProfile();
  },

  setResumeProfile(profile: any) {
    return mockStore.setResumeProfile(profile);
  },
};
