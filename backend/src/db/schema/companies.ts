import { pgTable, uuid, timestamp, text, varchar} from 'drizzle-orm/pg-core'
import { users } from './users.js'

export const companies = pgTable("companies", {
    id : uuid().primaryKey().defaultRandom(),
    recruiterId : uuid().unique().notNull().references(
        () => users.id,
        {onDelete : "cascade"}
    ),
    name : varchar({length : 255}).notNull(),
    logoUrl : text(),
    about : text(),
    website : varchar({length : 255}),
    createdAt : timestamp().notNull().defaultNow(),
    updatedAt : timestamp().notNull().defaultNow()
})