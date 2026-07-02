import { LoginInput, RefreshTokenPayload, RegisterInput } from './auth.types.js'
import { createUser, deleteRefreshToken, findRefreshTokenByUserId, findUserByEmail, findUserById, saveRefreshToken } from './auth.repository.js'
import { ApiError } from '../../utils/ApiError.js';
import { hashPassword, comparePassword } from '../../utils/bcrypt.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt.js';

export const registerUser = async (body : RegisterInput) => {

    const { name, email, password, role } = body;

    const user = await findUserByEmail(email);
    
    if(user){
        throw new ApiError(400, "Email already exist")
    }

    const hashedPasswoed = await hashPassword(password);

    const newUser = await createUser(name, email, hashedPasswoed, role);

    const accessToken = generateAccessToken(newUser.id, newUser.role);

    const refreshToken = generateRefreshToken(newUser.id);

    const hashedRefreshToken = await hashPassword(refreshToken);

    const expiresAt = new Date(
        Date.now() + 7*24*60*60*1000
    );

    await saveRefreshToken(newUser.id, hashedRefreshToken, expiresAt);

    return {
        newUser,
        accessToken,
        refreshToken
    }
}


export const loginUser = async (body : LoginInput)=>{

    const { email, password } = body;

    const user = await findUserByEmail(email);

    if(!user){
        throw new ApiError(400, "Invalid email or password");
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if(!isPasswordValid){
        throw new ApiError(400, "Invalid email or password");
    }

    const accessToken = generateAccessToken(user.id, user.role);

    const refreshToken = generateRefreshToken(user.id);

    const hashedRefreshToken = await hashPassword(refreshToken);

    const expiresAt = new Date(
        Date.now() + 7*24*60*60*1000
    );

    saveRefreshToken(user.id, hashedRefreshToken, expiresAt);

    return {
        user,
        accessToken,
        refreshToken
    }
}


export const refreshToken = async (token : string) => {
    const payload = await verifyRefreshToken(token) as RefreshTokenPayload;

    if(!payload){
        throw new ApiError(401, "Invalid refresh token");
    }

    const userId = payload.userId;

    const user = await findUserById(userId);

    if(!user){
        throw new ApiError(401, "Invalid refresh token");
    }

    if(!user.isActive){
        throw new ApiError(401, "Unauthorized");
    }

    const storedRefreshToken = await findRefreshTokenByUserId(userId);

    if(!storedRefreshToken){
        throw new ApiError(401, "Invalid refresh token");
    }

    const isRefreshTokenValid = await comparePassword(token, storedRefreshToken.hashedToken);

    if(!isRefreshTokenValid){
        throw new ApiError(401, "Invalid refresh token");
    }

    const accessToken = generateAccessToken(user.id, user.role);

    const refreshToken = generateRefreshToken(user.id);

    const hashedRefreshToken = await hashPassword(refreshToken);

    const expiresAt = new Date(
        Date.now() + 7*24*60*60*1000
    )

    await saveRefreshToken(user.id, hashedRefreshToken, expiresAt);

    return {
        accessToken,
        refreshToken
    }    
}


export const logoutUser = async (userId : string)=>{
    await deleteRefreshToken(userId);
    return true;
}