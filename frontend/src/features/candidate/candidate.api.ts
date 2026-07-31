import api from '../../lib/axios'

export const candidateApi = {
    getCandidate: async () => {
        const result = await api.get('/candidate/profile');
        return result.data;
    },

    updateCandidate: async (data: FormData) => {
        const result = await api.post('/candidate/profile', data);
        return result.data;
    },

    getJobs: async (filters: { search?: string; location?: string; jobType?: string; minSalary?: number }) => {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.location) params.append('location', filters.location);
        if (filters.jobType && filters.jobType !== 'All') params.append('jobType', filters.jobType);
        if (filters.minSalary) params.append('minSalary', String(filters.minSalary));

        const result = await api.get(`/jobs?${params.toString()}`);
        return result.data;
    },

    getJobById: async (jobId: string) => {
        const result = await api.get(`/jobs/${jobId}`);
        return result.data;
    },

    saveJob: async (jobId: string) => {
        const result = await api.post(`/saved-jobs/${jobId}`);
        return result.data;
    },

    getSavedJobs: async () => {
        const result = await api.get('/saved-jobs');
        return result.data;
    },

    removeSavedJob: async (jobId: string) => {
        const result = await api.delete(`/saved-jobs/${jobId}`);
        return result.data;
    },

    applyToJob: async (jobId: string) => {
        const result = await api.post('/applications', { jobId });
        return result.data;
    },

    getMyApplications: async () => {
        const result = await api.get('/applications/me');
        return result.data;
    },

    analyzeJobMatch: async (jobId: string) => {
        const result = await api.post(`/candidate/job/${jobId}/analyze`);
        return result.data;
    },
}