import api from '@/lib/axios'

interface LoginRequest {
    email : string;
    password : string;
}

interface RegisterRequest {
    name : string;
    email : string;
    password : string;
    role : "candidate" | "recruiter" ;
}


export const authApi = {
    login : async (data : LoginRequest) => {
        const resposne = await api.post("/auth/login", data);
        return resposne.data;
    },

    register : async (data : RegisterRequest) => {
        const resposne = await api.post("/auth/register", data);
        return resposne.data;
    },

    refresh : async () => {
        const response = await api.get("/auth/refresh");
        return response.data;
    },

    logout : async () => {
        await api.get("/auth/logout");
    }

}
