import { z } from 'zod'

export const companySchema = z.object({
    name: z.string().min(1, "Company name is required"),
    about: z.string().optional(),
    website: z.url("Invalid website URL").optional(),
})