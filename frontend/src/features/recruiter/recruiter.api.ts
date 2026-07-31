import api from '@/lib/axios'

export const recruiterApi = {
    createOrUpdateCompany : async (data : FormData) => {
        const response = await api.post('/companies', data);
        return response.data;
    },

    getMyCompany : async () => {
        const response  = await api.get("/companies");
        return response.data;
    },

    createJob : async (jobData: any) => {
        const response = await api.post("/jobs", jobData);
        return response.data;
    },

    getAllJobs : async () => {
        const response = await api.get("/jobs/me");
        return response.data;
    },

    getJobById : async (jobId: string) => {
        const response = await api.get(`/jobs/${jobId}`);
        return response.data;
    },

    updateJob : async (jobId: string, jobData: any) => {
        const response = await api.put(`/jobs/${jobId}`, jobData);
        return response.data;
    },

    deleteJob : async (jobId: string) => {
        const response = await api.delete(`/jobs/${jobId}`);
        return response.data;
    },

    getApplicants: async (jobId: string) => {
        const result = await api.get(`/applications/job/${jobId}`);
        return result.data;
    },

    updateApplicationStatus: async (applicationId: string, status: string) => {
        const result = await api.patch(`/applications/${applicationId}/status`, { status });
        return result.data;
    },

    analyzeAllForJob: async (jobId: string) => {
        const result = await api.post(`/analysis/job/${jobId}/analyze-all`);
        return result.data;
    },

    analyzeSingle: async (applicationId: string) => {
        const result = await api.post(`/analysis/application/${applicationId}/analyze`);
        return result.data;
    },

    getApplicationDetail: async (applicationId: string) => {
        const result = await api.get(`/applications/${applicationId}`);
        return result.data;
    },

    getApplicationAnalysis: async (applicationId: string) => {
        const result = await api.get(`/analysis/application/${applicationId}`);
        return result.data;
    },

    getRecentApplications: async () => {
        const result = await api.get('/applications/recruiter/recent');
        return result.data;
    },
}