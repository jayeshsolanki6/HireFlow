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

interface RecruiterState {
    isSidebarCollapsed : boolean;
    isLoading : boolean;
    company : Company | null;

    setIsSidebarCollapsed : (isCollapsed : boolean) => void;

    createOrUpdateCompany : (data : FormData) => Promise<boolean>;
    getCompany : () => Promise<void>;
}

export const useRecruiterStore = create<RecruiterState>((set) => ({
    isSidebarCollapsed : false,
    isLoading : false,
    company : null,

    setIsSidebarCollapsed : (isCollapsed : boolean) => set({
        isSidebarCollapsed : isCollapsed
    }),

    createOrUpdateCompany : async (data) => {
        set({isLoading : true});
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
        } finally {
            set({isLoading : false});
        }
    },

    getCompany : async () => {
        if(useRecruiterStore.getState().company) return;
        set({isLoading : true});
        try {
            const response = await recruiterApi.getMyCompany();
            set({company : response.data});
            console.log("Company data fetched", useRecruiterStore.getState().company);
        } finally {
            set({isLoading : false});
        }
    }
}))