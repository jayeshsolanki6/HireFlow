export interface RegisterInput {
    name : string,
    email : string,
    password : string,
    role : "candidate" | "recruiter"
}

export interface LoginInput {
    email : string,
    password : string
}

export interface RefreshTokenPayload {
    userId : string,
}