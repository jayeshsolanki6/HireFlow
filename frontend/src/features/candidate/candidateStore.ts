import { create } from 'zustand';
import { candidateApi } from './candidate.api';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

interface Candidate {
    name : string,
    email : string,
    role : string,
    profileImageUrl? : string,
    bio? : string,
    resumeUrl? : string
}

interface Job {
    jobId: string;
    companyId: string;
    companyName: string;
    companyLogoUrl: string;
    companyWebsite: string;
    title: string;
    description: string;
    requirements: string;
    salaryMin?: number;
    salaryMax?: number;
    location: string;
    jobType: 'full_time' | 'part_time' | 'internship';
    jobStatus: 'open' | 'draft';
    deadline?: string;
    createdAt: string;
}

interface JobFilters {
    search: string;
    location: string;
    jobType: 'All' | 'full_time' | 'part_time' | 'internship';
    minSalary: number;
}

interface Application {
    id: string;
    jobId: string;
    jobTitle: string;
    companyName: string;
    companyLogo: string;
    appliedAt: string;
    status: 'applied' | 'shortlisted' | 'rejected' | 'hired';
}

interface CandidateState {
    isSidebarCollapsed: boolean;
    isLoading: boolean;
    candidate: Candidate | null;

    jobs: Job[];
    jobFilters: JobFilters;
    savedJobs: Job[];
    savedJobIds: Set<string>;

    myApplications: Application[];
    appliedJobIds: Set<string>;

    jobMatchAnalysis: any | null;
    isAnalyzingJobMatch: boolean;
    analyzeJobMatch: (jobId: string) => Promise<void>;
    clearJobMatchAnalysis: () => void;

    getMyApplications: () => Promise<void>;
    applyToJob: (jobId: string) => Promise<boolean>;


    getCandidateProfile: () => Promise<void>;
    updateCandidateProfile: (data: FormData) => Promise<boolean>;

    setIsSidebarCollapsed: (isCollapsed: boolean) => void;

    setJobFilters: (filters: Partial<JobFilters>) => void;
    resetJobFilters: () => void;
    fetchJobs: () => Promise<void>;

    getSavedJobs: () => Promise<void>;
    saveJob: (jobId: string) => Promise<boolean>;
    removeSavedJob: (jobId: string) => Promise<boolean>;
}

const defaultJobFilters: JobFilters = {
    search: '',
    location: '',
    jobType: 'All',
    minSalary: 0,
};

export const useCandidateStore = create<CandidateState>((set) => ({
    isSidebarCollapsed : false,
    isLoading : false,
    candidate : null,

    jobs: [],
    jobFilters: defaultJobFilters,
    savedJobs: [],
    savedJobIds: new Set(),

    myApplications: [],
    appliedJobIds: new Set(),

    jobMatchAnalysis: null,
    isAnalyzingJobMatch: false,

    setIsSidebarCollapsed : (isCollapsed : boolean) => set({
        isSidebarCollapsed : isCollapsed
    }),

    getCandidateProfile : async () => {
        set({isLoading : true});
        try {
            const result = await candidateApi.getCandidate();
            set({ candidate : result.data });
        } finally {
            set({isLoading : false});
        }
    },

    updateCandidateProfile : async (data : FormData) => {
        try {
            const result = await candidateApi.updateCandidate(data);
            set({ candidate : result.data });
            toast.success("Profile updated successfully!");
            return true;
        } catch (error) {
            console.error(error);
            if(error instanceof AxiosError){
                toast.error(error.response?.data?.message || error.message ||'Failed to update profile.');
            } else {
                toast.error("Failed to update profile.");
            }
            return false;
        }
    },

    setJobFilters: (filters) => set((state) => ({
        jobFilters: { ...state.jobFilters, ...filters }
    })),

    resetJobFilters: () => set({ jobFilters: defaultJobFilters }),

    fetchJobs: async () => {
        set({ isLoading: true });
        try {
            const jobFilters = useCandidateStore.getState().jobFilters;
            const result = await candidateApi.getJobs({
                search: jobFilters.search || undefined,
                location: jobFilters.location || undefined,
                jobType: jobFilters.jobType !== 'All' ? jobFilters.jobType : undefined,
                minSalary: jobFilters.minSalary || undefined,
            });
            set({ jobs: result.data });
        } catch (error) {
            console.error(error);
            toast.error("Failed to load jobs.");
        } finally {
            set({ isLoading: false });
        }
    },

    getSavedJobs: async () => {
        set({ isLoading: true });
        try {
            const result = await candidateApi.getSavedJobs();
            set({
                savedJobs: result.data,
                savedJobIds: new Set(result.data.map((job: Job) => job.jobId))
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to load saved jobs.");
        } finally {
            set({ isLoading: false });
        }
    },

    saveJob: async (jobId) => {
        try {
            await candidateApi.saveJob(jobId);
            set((state) => ({
                savedJobIds: new Set(state.savedJobIds).add(jobId)
            }));
            toast.success("Job saved!");
            return true;
        } catch (error) {
            console.error(error);
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message || error.message || 'Failed to save job.');
            } else {
                toast.error("Failed to save job.");
            }
            return false;
        }
    },

    removeSavedJob: async (jobId) => {
        try {
            await candidateApi.removeSavedJob(jobId);
            set((state) => {
                const next = new Set(state.savedJobIds);
                next.delete(jobId);
                return {
                    savedJobIds: next,
                    savedJobs: state.savedJobs.filter((job) => job.jobId !== jobId)
                };
            });
            toast.success("Removed from saved jobs.");
            return true;
        } catch (error) {
            console.error(error);
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message || error.message || 'Failed to remove saved job.');
            } else {
                toast.error("Failed to remove saved job.");
            }
            return false;
        }
    },

    getMyApplications: async () => {
        try {
            const result = await candidateApi.getMyApplications();
            set({
                myApplications: result.data,
                appliedJobIds: new Set(result.data.map((app: Application) => app.jobId))
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to load applications.");
        }
    },

    applyToJob: async (jobId) => {
        try {
            await candidateApi.applyToJob(jobId);
            set((state) => ({
                appliedJobIds: new Set(state.appliedJobIds).add(jobId)
            }));
            toast.success("Application submitted successfully!");
            return true;
        } catch (error) {
            console.error(error);
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message || error.message || 'Failed to submit application.');
            } else {
                toast.error("Failed to submit application.");
            }
            return false;
        }
    },

    analyzeJobMatch: async (jobId) => {
        set({ isAnalyzingJobMatch: true });
        try {
            const result = await candidateApi.analyzeJobMatch(jobId);
            set({ jobMatchAnalysis: result.data });
        } catch (error) {
            console.error(error);
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message || error.message || 'Failed to analyze match.');
            } else {
                toast.error("Failed to analyze match.");
            }
        } finally {
            set({ isAnalyzingJobMatch: false });
        }
    },

    clearJobMatchAnalysis: () => set({ jobMatchAnalysis: null }),
}));