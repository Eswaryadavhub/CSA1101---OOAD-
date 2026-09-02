const API_BASE = 'http://localhost:5000/api';

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
      // Ignore parse errors
    }
    throw new Error(errorMsg);
  }
  return res.json();
}

export const api = {
  // Auth
  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  // Profile
  async getProfile() {
    const res = await fetch(`${API_BASE}/profile`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async updateProfile(profileData: any) {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData),
    });
    return handleResponse(res);
  },

  // Skills
  async getSkills() {
    const res = await fetch(`${API_BASE}/skills`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async addSkill(skillData: { skillId?: string; skillName?: string; category?: string; proficiency: string }) {
    const res = await fetch(`${API_BASE}/skills`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(skillData),
    });
    return handleResponse(res);
  },

  async removeSkill(skillId: string) {
    const res = await fetch(`${API_BASE}/skills/skill/${skillId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Opportunities
  async getOpportunities(filters: { type?: string; search?: string; skill?: string } = {}) {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.search) params.append('search', filters.search);
    if (filters.skill) params.append('skill', filters.skill);

    const res = await fetch(`${API_BASE}/opportunities?${params.toString()}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async getOpportunityDetails(id: string) {
    const res = await fetch(`${API_BASE}/opportunities/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Saved Opportunities
  async getSavedOpportunities() {
    const res = await fetch(`${API_BASE}/saved-opportunities`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async saveOpportunity(opportunityId: string) {
    const res = await fetch(`${API_BASE}/saved-opportunities`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ opportunityId }),
    });
    return handleResponse(res);
  },

  async unsaveOpportunity(opportunityId: string) {
    const res = await fetch(`${API_BASE}/saved-opportunities/${opportunityId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Matches, Skill Gaps, Career Paths, Learning Plans
  async getMatches() {
    const res = await fetch(`${API_BASE}/matches`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async getSkillGaps() {
    const res = await fetch(`${API_BASE}/skill-gaps`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async getCareerPaths() {
    const res = await fetch(`${API_BASE}/career-paths`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async getLearningPath() {
    const res = await fetch(`${API_BASE}/learning-path`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Applications
  async applyOpportunity(opportunityId: string) {
    const res = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ opportunityId }),
    });
    return handleResponse(res);
  },

  async getApplications() {
    const res = await fetch(`${API_BASE}/applications`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Admin
  async getAdminStatistics() {
    const res = await fetch(`${API_BASE}/admin/statistics`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async getAdminStudents() {
    const res = await fetch(`${API_BASE}/admin/students`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async createOpportunity(oppData: any) {
    const res = await fetch(`${API_BASE}/admin/opportunities`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(oppData),
    });
    return handleResponse(res);
  },

  async updateOpportunity(id: string, oppData: any) {
    const res = await fetch(`${API_BASE}/admin/opportunities/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(oppData),
    });
    return handleResponse(res);
  },

  async deleteOpportunity(id: string) {
    const res = await fetch(`${API_BASE}/admin/opportunities/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};
