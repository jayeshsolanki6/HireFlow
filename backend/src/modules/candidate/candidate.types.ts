
export interface ProfileInput {
    userId: string;
    name: string;
    bio: string | null;
    profileImageBuffer?: Buffer;
    resumeBuffer?: Buffer;
}