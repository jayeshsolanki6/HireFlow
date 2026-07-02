import { pgTable, uuid, primaryKey} from 'drizzle-orm/pg-core'
import { jobs } from './jobs.js'
import { skills } from './skills.js'


export const jobSkills = pgTable(
    "job_skills", 
    {
        jobId : uuid().notNull().references(
            () => jobs.id,
            {onDelete:"cascade"}
        ),
        skillId : uuid().notNull().references(
            () => skills.id,
            {onDelete:"cascade"}
        ),
    },
    (table) => ({
        pk : primaryKey({columns : [table.jobId, table.skillId]})
    })
);