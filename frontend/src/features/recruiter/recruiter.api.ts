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
        const response = await api.get("/jobs");
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

}