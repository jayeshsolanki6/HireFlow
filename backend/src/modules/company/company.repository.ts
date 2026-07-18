import { eq, sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import { companies } from "../../db/schema/companies.js";

export const findCompanyByRecruiterId = async (recruiterId : string) => {
    const result = await db
        .select()
        .from(companies)
        .where(eq(companies.recruiterId, recruiterId));

    return result[0];
}

export const createOrUpdateCompany = async (
    recruiterId: string, 
    name: string, 
    about: string | null,
    website: string | null,
    logoUrl: string | null
) => {
    const result = await db
        .insert(companies)
        .values({
            recruiterId,
            name,
            logoUrl,
            about,
            website
        })
        .onConflictDoUpdate({
            target : companies.recruiterId,
            set : {
                name,
                logoUrl: logoUrl ?? sql`${companies.logoUrl}`,
                about,
                website
            }
        })
        .returning();
    
    return result[0];
}

// export const updateCompany = async (
//     recruiterId: string, 
//     name: string,
//     about: string | null,
//     website: string | null,
//     logoUrl: string | null
// ) => {
//     const result = await db
//         .update(companies)
//         .set({
//             name,
//             logoUrl,
//             about,
//             website
//         })
//         .where(eq(companies.recruiterId, recruiterId))
//         .returning();

//     return result[0];
// }