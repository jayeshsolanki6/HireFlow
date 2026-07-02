import jwt from 'jsonwebtoken'

export const generateAccessToken = (userId : string, role : string) => {
    const token = jwt.sign(
        {userId, role},
        process.env.ACCESS_TOKEN_SECRET as string,
        {expiresIn: '15m'}
    )
    return token;
}

export const generateRefreshToken = (userId : string) => {
    const token = jwt.sign(
        {userId},
        process.env.REFRESH_TOKEN_SECRET as string,
        {expiresIn: '7d'}
    )
    return token;
}

export const verifyAccessToken = (token : string) => {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
}

export const verifyRefreshToken = (token : string) => {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string);
}
