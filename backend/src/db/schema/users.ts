import { pgTable, pgEnum, timestamp, uuid, varchar, boolean } from 'drizzle-orm/pg-core'

export const roleEnum = pgEnum("role", [
    "candidate", "recruiter", "admin"
]);

export const users = pgTable("users", {
    id : uuid().primaryKey().defaultRandom(),
    name : varchar({ length : 100}).notNull(),
    email : varchar({ length : 255}).notNull().unique(),
    password : varchar({ length: 255 }).notNull(),
    role : roleEnum().notNull(),
    isActive : boolean().notNull().default(true),
    createdAt : timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
});

