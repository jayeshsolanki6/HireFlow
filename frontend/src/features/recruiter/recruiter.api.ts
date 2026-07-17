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

    createJob : async () => {

    },


}