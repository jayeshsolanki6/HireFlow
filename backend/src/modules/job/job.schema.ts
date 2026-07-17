import { z } from "zod";

export const jobSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(255, "Title must be less than 255 characters"),
    description: z.string().trim().min(1, "Description is required"),
    requirements: z.string().trim().min(1, "Requirements are required"),
    salaryMin: z.coerce.number().optional(),
    salaryMax: z.coerce.number().optional(),
    location: z.string().trim().min(1, "Location is required").max(255, "Location must be less than 255 characters"),
    jobType: z.enum(["full_time", "part_time", "internship"], "Job type is required"),
    jobStatus: z.enum(["open", "closed", "draft"], "Job status is required"),
    deadline: z.coerce.date().optional(),
  })
  .refine(
    (data) =>
      data.salaryMin === undefined ||
      data.salaryMax === undefined ||
      data.salaryMin <= data.salaryMax,
    {
      message: "Minimum salary cannot be greater than maximum salary",
      path: ["salaryMax"],
    }
  );