import { create } from 'zustand'
import { toast } from 'sonner'

import { authApi } from './auth.api';
import { AxiosError } from 'axios';

interface User {
    id : string;
    name : string;
    email : string;
    role : "candidate" | "recruiter" | "admin";
}

interface AuthState {
    user : User | null;
    accessToken : string | null;
    isLoggingIn : boolean;
    isSigningUp : boolean;
    isLoading : boolean;

    login : (email : string, password : string) => Promise<"candidate" | "recruiter" | "admin" | null>;
    register : (name : string, email : string, password : string, role : "candidate" | "recruiter") => Promise<"candidate" | "recruiter" | null>;
    refresh : () => Promise<void>;
    logout : () => Promise<void>;
}


export const useAuthStore = create<AuthState>((set)=>({
    user : null,
    accessToken : null,
    isLoggingIn : false,
    isSigningUp : false,
    isLoading : true,

    login : async (email : string, password : string) => {
        console.log('Logging in with email:', email, 'and password:', password);
        set({ isLoggingIn : true });
        try {
            const response = await authApi.login({ email, password });
            set({
                user : response.data.user,
                accessToken : response.data.accessToken
            });
            toast.success('Login successful!');
            return response.data.user.role;
        } catch (error) {
            if(error instanceof AxiosError){
                toast.error(error.response?.data?.message || error.message ||'Login failed. Please try again.');
            } else {
                toast.error('Login failed. Please try again.');
            }
            console.error('Login failed:', error);
            return null;
        } finally {
            set({ isLoggingIn : false });
        }
    },

    register : async (name : string, email : string, password : string, role : "candidate" | "recruiter") => {
        set({ isSigningUp : true });
        try {
            const response = await authApi.register({ name, email, password, role });
            set({
                user : response.data.user,
                accessToken : response.data.accessToken
            });
            toast.success('Registration successful!');
            return response.data.user.role;
        } catch (error) {
            if(error instanceof AxiosError){
                toast.error(error.response?.data?.message || error.message ||'Registration failed. Please try again.');
            } else {
                toast.error('Registration failed. Please try again.');
            }
            console.error('Registration failed:', error);
            return null;
        } finally {
            set({ isSigningUp : false });
        }
    },

    refresh : async () => {
        set({ isLoading : true });
        try {
            const response = await authApi.refresh();
            set({
                user : response.data.user,
                accessToken : response.data.accessToken
            });
        } catch (error) {
            set({
                user : null,
                accessToken : null
            });
        } finally {
            set({ isLoading : false });
        }
    },

    logout : async () => {
        try {
            await authApi.logout();
            set({
                user : null,
                accessToken : null
            });
            toast.success('Logged out successfully!');
        } catch (error) {
            toast.error('Logout failed. Please try again.');
            console.error('Logout failed:', error);
        }
    }
}))