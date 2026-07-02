import { pgTable, uuid, timestamp, primaryKey} from 'drizzle-orm/pg-core'
import { users } from './users.js'
import { jobs } from './jobs.js'

export const savedJobs = pgTable(
    "saved_jobs",
    {
        userId : uuid().notNull().references(
            () => users.id,
            { onDelete: "cascade" }
        ),
        jobId: uuid().notNull().references(
            () => jobs.id,
            { onDelete: "cascade" }
        ),
        savedAt : timestamp().notNull().defaultNow()
    },
    (table) => ({
        pk : primaryKey({columns : [table.userId, table.jobId]})
    })
)