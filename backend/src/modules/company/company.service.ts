import { ApiError } from "../../utils/ApiError.js";
import { uploadImage } from "../../utils/uploadToCloudinary.js";
import { createOrUpdateCompany, findCompanyByRecruiterId } from "./company.repository.js";
import { CreateCompanyInput } from "./company.types.js";

export const company = {
    createOrUpdateCompany : async (data : CreateCompanyInput) => {
        const logoUrl = data.logoBuffer ? await uploadImage(data.logoBuffer) : null;

        const company = await createOrUpdateCompany(data.recruiterId, data.name, data.about, data.website, logoUrl);

        return company;
    },

    getMyCompany : async (recruiterId : string) => {
        const company = await findCompanyByRecruiterId(recruiterId);
        if(!company) {
            throw new ApiError(404, "Company not found");
        }
        return company;
    },

    // updateCompany : async (data : CreateCompanyInput) => {
    //     const existingCompany = await findCompanyByRecruiterId(data.recruiterId);
    //     if(!existingCompany) {
    //         throw new ApiError(404, "Company not found");
    //     }
    //     const logoUrl = data.logoBuffer ? await uploadImage(data.logoBuffer) : existingCompany.logoUrl;
    //     const updatedCompany = await createUpdateCompany(data.recruiterId, data.name, data.about, data.website, logoUrl);
    //     return updatedCompany;
    // }
}