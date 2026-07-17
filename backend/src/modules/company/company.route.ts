import { Router } from "express";

import { createOrUpdateCompany , getMyCompany } from "./company.controller.js";
import { validate } from "../../middleware/validate.js";
import { accessSchema } from "../auth/auth.schema.js";
import { authenticate } from "../../middleware/authenticate.js";
import { upload } from "../../middleware/upload.js";
import { companySchema } from "./company.schema.js";
import { authorize } from "../../middleware/authorize.js";

const router = Router();

// Create or Update company profile
router.post(
    "/", 
    validate(accessSchema, "headers"), 
    authenticate, 
    authorize(["recruiter"]),
    upload.single("logo"),
    validate(companySchema, "body"), 
    createOrUpdateCompany
);

// Get the company profile
router.get(
    "/", 
    validate(accessSchema, "headers"), 
    authenticate, 
    authorize(["recruiter"]),
    getMyCompany
);

// Update the company profile
// router.put(
//     "/", 
//     validate(accessSchema, "headers"), 
//     authenticate, 
//     authorize(["recruiter"]),
//     upload.single("logo"), 
//     validate(companySchema, "body"), 
//     updateCompany
// );

export default router;