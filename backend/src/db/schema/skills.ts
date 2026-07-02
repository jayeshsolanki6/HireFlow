import { pgTable, uuid, timestamp, varchar} from 'drizzle-orm/pg-core'

export const skills = pgTable("skills", {
    id : uuid().primaryKey().defaultRandom(),
    name : varchar({length : 255}).notNull().unique(),
    createdAt : timestamp().notNull().defaultNow()
})