import { eq } from 'drizzle-orm';

import { db } from '../../db/index.js'
import { users } from '../../db/schema/users.js'
import { refreshTokens } from '../../db/schema/refreshTokens.js';

export const findUserByEmail = async (email : string) => {
    const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email));
    
    return result[0];
}


export const findUserById = async (id : string) => {
    const result = await db
        .select()
        .from(users)
        .where(eq(users.id, id));
    return result[0];
}

export const findRefreshTokenByUserId = async (userId : string) => {
    const result = await db
        .select()
        .from(refreshTokens)
        .where(eq(refreshTokens.userId, userId));

    return result[0];
}

export const createUser = async (
    name : string,
    email : string,
    password : string,
    role : "candidate" | "recruiter"
) => {
    const result = await db
        .insert(users)
        .values({name, email, password, role})
        .returning();

    return result[0];
}


export const saveRefreshToken = async (
    userId : string,
    hashedToken : string,
    expiresAt : Date
) => {
    await db
        .insert(refreshTokens)
        .values({ userId, hashedToken, expiresAt })
        .onConflictDoUpdate({
            target : refreshTokens.userId,
            set : {
                hashedToken,
                expiresAt
            }
        })
}


export const deleteRefreshToken = async (
    userId : string
) => {
    await db
        .delete(refreshTokens)
        .where(eq(refreshTokens.userId, userId))
}