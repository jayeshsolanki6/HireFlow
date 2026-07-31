import { eq, sql } from "drizzle-orm"
import { db } from "../../db/index.js"
import { users } from "../../db/schema/users.js"


export const updateCandidateProfile = async (
    userId: string,
    name: string,
    bio: string | null,
    profileImageUrl: string | null,
    resumeUrl: string | null
) => {
    const result = await db
        .update(users)
        .set({
            name,
            bio,
            profileImageUrl : profileImageUrl ?? sql`${users.profileImageUrl}`,
            resumeUrl : resumeUrl ?? sql`${users.resumeUrl}`
        })
        .where(eq(users.id, userId))
        .returning()
    
    return result[0]
}


export const getCandidateProfile = async (userId: string) => {
    const result = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
    return result[0]
}