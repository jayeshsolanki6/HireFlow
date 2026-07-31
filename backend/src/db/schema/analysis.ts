import { pgTable, uuid, integer, jsonb, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { applications } from "./applications.js";

export const analysisStatusEnum = pgEnum("analysis_status", [
    "pending", "processing", "completed", "failed",
]);

export const analyses = pgTable("analyses", {
    id: uuid().primaryKey().defaultRandom(),
    applicationId: uuid().notNull().unique().references(
            () => applications.id, 
            { onDelete: "cascade" }
        ),
    status: analysisStatusEnum().notNull().default("pending"),
    score: integer(),
    analysis: jsonb(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow()
});