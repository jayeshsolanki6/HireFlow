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

interface Applicant {
    applicationId: string;
    candidateId: string;
    candidateName: string;
    resumeUrl: string;
    appliedAt: string;
    status: 'applied' | 'shortlisted' | 'rejected' | 'hired';
    analysisStatus: 'pending' | 'processing' | 'completed' | 'failed' | null;
    analysisScore: number | null;
    analysisRecommendation: string | null;
}

interface RecruiterState {
    isSidebarCollapsed : boolean;
    isLoading : boolean;
    company : Company | null;

    allJobs : Job[];

    applicants: Applicant[];
    isAnalyzingAll: boolean;
    applicationDetail: any | null;
    applicationAnalysis: any | null;
    isFetchingAnalysis: boolean;

    recentApplications: any[];
    totalOpenApplications: number;
    getRecentApplications: () => Promise<void>;

    getApplicationDetail: (applicationId: string) => Promise<void>;
    getApplicationAnalysis: (applicationId: string) => Promise<void>;
    clearApplicationDetail: () => void;
    
    setIsSidebarCollapsed : (isCollapsed : boolean) => void;
    
    createOrUpdateCompany : (data : FormData) => Promise<boolean>;
    getCompany : () => Promise<void>;
    
    getAllJobs : () => Promise<void>;
    getJobById : (jobId : string) => Promise<Job | null>;
    createJob : (jobData : Partial<Job>) => Promise<boolean>;
    updateJob : (jobId : string, jobData : Partial<Job>) => Promise<boolean>;
    deleteJob : (jobId : string) => Promise<boolean>;
    
    clearApplicants: () => void;
    getApplicants: (jobId: string) => Promise<void>;
    updateApplicationStatus: (applicationId: string, status: string) => Promise<boolean>;
    analyzeAllForJob: (jobId: string) => Promise<void>;
    analyzeSingleApplication: (applicationId: string) => Promise<void>;
}

export const useRecruiterStore = create<RecruiterState>((set) => ({
    isSidebarCollapsed : false,
    isLoading : false,
    company : null,

    allJobs : [],

    applicants: [],
    isAnalyzingAll: false,

    applicationDetail: null,
    applicationAnalysis: null,
    isFetchingAnalysis: false,

    recentApplications: [],
    totalOpenApplications: 0,

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

    clearApplicants: () => set({ applicants: [] }),

    getApplicants: async (jobId) => {
        set({ isLoading: true });
        try {
            const result = await recruiterApi.getApplicants(jobId);
            set({ applicants: result.data });
        } catch (error) {
            console.error(error);
            toast.error("Failed to load applicants.");
        } finally {
            set({ isLoading: false });
        }
    },

    updateApplicationStatus: async (applicationId, status) => {
        try {
            const result = await recruiterApi.updateApplicationStatus(applicationId, status);
            set((state) => ({
                applicants: state.applicants.map((a) =>
                    a.applicationId === applicationId ? { ...a, status: result.data.status } : a
                )
            }));
            toast.success("Application status updated!");
            return true;
        } catch (error) {
            console.error(error);
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message || error.message || 'Failed to update status.');
            } else {
                toast.error("Failed to update status.");
            }
            return false;
        }
    },

    analyzeAllForJob: async (jobId) => {
        set({ isAnalyzingAll: true });
        try {
            await recruiterApi.analyzeAllForJob(jobId);
            // mark all non-completed applicants as pending locally, so polling picks them up immediately
            set((state) => ({
                applicants: state.applicants.map((a) =>
                    a.analysisStatus === 'processing' ? a : { ...a, analysisStatus: 'pending' }
                )
            }));
            toast.success("Analysis started for all applicants.");
        } catch (error) {
            console.error(error);
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message || error.message || 'Failed to start analysis.');
            } else {
                toast.error("Failed to start analysis.");
            }
        } finally {
            set({ isAnalyzingAll: false });
        }
    },

    analyzeSingleApplication: async (applicationId) => {
        try {
            await recruiterApi.analyzeSingle(applicationId);
            set((state) => ({
                applicants: state.applicants.map((a) =>
                    a.applicationId === applicationId ? { ...a, analysisStatus: 'pending' } : a
                )
            }));
            toast.success("Analysis started.");
        } catch (error) {
            console.error(error);
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message || error.message || 'Failed to start analysis.');
            } else {
                toast.error("Failed to start analysis.");
            }
        }
    },

    getApplicationDetail: async (applicationId) => {
        set({ isLoading: true });
        try {
            const result = await recruiterApi.getApplicationDetail(applicationId);
            set({ applicationDetail: result.data });
        } catch (error) {
            console.error(error);
            toast.error("Failed to load application.");
        } finally {
            set({ isLoading: false });
        }
    },

    getApplicationAnalysis: async (applicationId) => {
        set({ isFetchingAnalysis: true });
        try {
            const result = await recruiterApi.getApplicationAnalysis(applicationId);
            set({ applicationAnalysis: result.data });
        } catch (error) {
            set({ applicationAnalysis: null });
        } finally {
            set({ isFetchingAnalysis: false });
        }
    },

    clearApplicationDetail: () => set({ applicationDetail: null, applicationAnalysis: null }),
    
    getRecentApplications: async () => {
        set({ isLoading: true });
        try {
            const result = await recruiterApi.getRecentApplications();
            set({
                recentApplications: result.data.recentApplications,
                totalOpenApplications: result.data.totalApplications
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to load recent applications.");
        } finally {
            set({ isLoading: false });
        }
    },
}))