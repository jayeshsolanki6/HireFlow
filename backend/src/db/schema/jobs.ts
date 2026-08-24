import { pgTable, uuid, timestamp, text, integer, varchar, pgEnum} from 'drizzle-orm/pg-core'
import { companies } from './companies.js'

export const jobTypeEnum = pgEnum("job_type", [
    "full_time", "part_time", "internship"
]);
export const jobStatusEnum = pgEnum("job_status", [
    "open", "draft"
]);

export const jobs = pgTable("jobs", {
    id : uuid().primaryKey().defaultRandom(),
    companyId : uuid().notNull().references(
        () => companies.id,
        {onDelete:"cascade"}
    ),
    title : varchar({length:255}).notNull(),
    description : text().notNull(),
    requirements : text().notNull(),
    salaryMin : integer(),
    salaryMax : integer(),
    location : varchar({length:255}).notNull(),
    jobType : jobTypeEnum().notNull(),
    jobStatus : jobStatusEnum().notNull(),
    deadline : timestamp(),
    createdAt : timestamp().notNull().defaultNow(),
    updatedAt : timestamp().notNull().defaultNow()
});