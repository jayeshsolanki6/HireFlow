

export interface CreateCompanyInput {
    recruiterId: string;
    name: string;
    logoBuffer?: Buffer;
    about: string | null;
    website: string | null;
}