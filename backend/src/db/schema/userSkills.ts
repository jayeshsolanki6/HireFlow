import { pgTable, uuid, primaryKey} from 'drizzle-orm/pg-core'
import { users } from "./users.js";
import { skills } from "./skills.js";

export const userSkills = pgTable(
    "user_skills", 
    {
        userId: uuid().notNull().references(
            () => users.id,
            { onDelete: "cascade" }
        ),
        skillId: uuid().notNull().references(
            () => skills.id, 
            { onDelete: "cascade" }
        ),
    },
    (table) => ({
        pk : primaryKey({columns : [table.userId, table.skillId]})
    })
);