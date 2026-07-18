
export interface CreateJobInput {
    recruiterId : string;
    title: string;
    description: string;
    requirements: string;
    salaryMin?: number;
    salaryMax?: number;
    location: string;
    jobType: "full_time" | "part_time" | "internship";
    jobStatus: "open" | "draft";
    deadline?: Date;
}