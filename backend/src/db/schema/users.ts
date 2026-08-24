import { pgTable, pgEnum, timestamp, uuid, varchar, boolean, text } from 'drizzle-orm/pg-core'

export const roleEnum = pgEnum("role", [
    "candidate", "recruiter"
]);

export const users = pgTable("users", {
    id : uuid().primaryKey().defaultRandom(),
    name : varchar({ length : 100}).notNull(),
    email : varchar({ length : 255}).notNull().unique(),
    password : varchar({ length: 255 }).notNull(),
    role : roleEnum().notNull(),
    profileImageUrl : text(),
    resumeUrl : text(),
    bio : text(),
    createdAt : timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
});

