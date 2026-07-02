import { pgTable, pgEnum, uuid, timestamp, text, uniqueIndex} from 'drizzle-orm/pg-core'
import { users } from './users.js'
import { jobs } from './jobs.js'

export const applicationStatusEnum = pgEnum("application_status", [
  "applied", "shortlisted", "rejected", "hired",
]);

export const applications = pgTable(
    "applications", 
    {
        id : uuid().primaryKey().defaultRandom(),
        jobId: uuid().notNull().references(
            () => jobs.id,
            { onDelete: "cascade" }
        ),
        candidateId: uuid().notNull().references(
            () => users.id, 
            { onDelete: "cascade" }
        ),
        resumeUrl : text().notNull(),
        status : applicationStatusEnum().notNull().default("applied"),
        appliedAt : timestamp().notNull().defaultNow(),
        updatedAt : timestamp().notNull().defaultNow()
    },
    (table) => ({
        unique_application : uniqueIndex().on(table.jobId, table.candidateId)
    })
);
