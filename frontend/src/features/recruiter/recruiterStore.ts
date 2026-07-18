import { create } from 'zustand'
import { toast } from 'sonner'

import { recruiterApi } from './recruiter.api';
import { AxiosError } from 'axios';

interface Company {
    name : string;
    logoUrl? : string;
    about? : string;
    website? : string;
}

interface Job {
    id : string;
    companyId : string;
    title : string;
    description : string;
    requirements : string;
    salaryMin? : number;
    salaryMax? : number;
    location : string;
    jobType : 'full_time' | 'part_time' | 'internship';
    jobStatus : 'open' | 'draft';
    deadline? : string;
    createdAt : string;
    updatedAt : string;
}

interface RecruiterState {
    isSidebarCollapsed : boolean;
    isLoading : boolean;
    company : Company | null;

    allJobs : Job[];

    setIsSidebarCollapsed : (isCollapsed : boolean) => void;

    createOrUpdateCompany : (data : FormData) => Promise<boolean>;
    getCompany : () => Promise<void>;

    getAllJobs : () => Promise<void>;
    getJobById : (jobId : string) => Promise<Job | null>;
    createJob : (jobData : Partial<Job>) => Promise<boolean>;
    updateJob : (jobId : string, jobData : Partial<Job>) => Promise<boolean>;
    deleteJob : (jobId : string) => Promise<boolean>;
}

export const useRecruiterStore = create<RecruiterState>((set) => ({
    isSidebarCollapsed : false,
    isLoading : false,
    company : null,

    allJobs : [],

    setIsSidebarCollapsed : (isCollapsed : boolean) => set({
        isSidebarCollapsed : isCollapsed
    }),

    createOrUpdateCompany : async (data) => {
        try {
            const response = await recruiterApi.createOrUpdateCompany(data);
            set({company : response.data});
            toast.success("Company profile updated successfully!");
            return true;
        } catch (error) {
            console.error(error);
            if(error instanceof AxiosError){
                toast.error(error.response?.data?.message || error.message ||'Failed to update company profile.');
            } else {
                toast.error("Failed to update company profile.");
            }
            return false;
        }
    },

    getCompany : async () => {
        if(useRecruiterStore.getState().company) return;
        set({isLoading : true});
        try {
            const response = await recruiterApi.getMyCompany();
            set({company : response.data});
        } finally {
            set({isLoading : false});
        }
    },

    getAllJobs : async () => {
        set({isLoading : true});
        try {
            const response = await recruiterApi.getAllJobs();
            set({allJobs : response.data});
        } catch (error) {
            console.error(error);
            toast.error("Failed to load jobs.");
        } finally {
            set({isLoading : false});
        }
    },

    getJobById : async (jobId) => {
        set({isLoading : true});
        try {
            const response = await recruiterApi.getJobById(jobId);
            return response.data;
        } catch (error) {
            console.error(error);
            toast.error("Failed to load job.");
            return null;
        } finally {
            set({isLoading : false});
        }
    },

    createJob : async (jobData) => {
        try {
            const response = await recruiterApi.createJob(jobData);
            set((state) => ({ allJobs : [...state.allJobs, response.data] }));
            toast.success("Job created successfully!");
            return true;
        } catch (error) {
            console.error(error);
            if(error instanceof AxiosError){
                toast.error(error.response?.data?.message || error.message || 'Failed to create job.');
            } else {
                toast.error("Failed to create job.");
            }
            return false;
        }
    },

    updateJob : async (jobId, jobData) => {
        try {
            const response = await recruiterApi.updateJob(jobId, jobData);
            set((state) => ({
                allJobs : state.allJobs.map((job) => job.id === jobId ? response.data : job)
            }));
            toast.success("Job updated successfully!");
            return true;
        } catch (error) {
            console.error(error);
            if(error instanceof AxiosError){
                toast.error(error.response?.data?.message || error.message || 'Failed to update job.');
            } else {
                toast.error("Failed to update job.");
            }
            return false;
        }
    },

    deleteJob : async (jobId) => {
        try {
            await recruiterApi.deleteJob(jobId);
            set((state) => ({
                allJobs : state.allJobs.filter((job) => job.id !== jobId)
            }));
            toast.success("Job deleted successfully!");
            return true;
        } catch (error) {
            console.error(error);
            if(error instanceof AxiosError){
                toast.error(error.response?.data?.message || error.message || 'Failed to delete job.');
            } else {
                toast.error("Failed to delete job.");
            }
            return false;
        }
    },
    
}))