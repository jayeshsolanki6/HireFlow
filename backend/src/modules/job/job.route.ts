import { Router } from 'express'
import { createJob, getAllJobs, getJob, updateJob, closeJob } from './job.controller.js';
import { validate } from '../../middleware/validate.js';
import { accessSchema } from "../auth/auth.schema.js";
import { authenticate } from "../../middleware/authenticate.js";
import { jobSchema } from "./job.schema.js";
import { authorize } from '../../middleware/authorize.js';

const router = Router();

// Create a new job
router.post(
    '/', 
    validate(accessSchema, 'headers'), 
    authenticate, 
    authorize(["recruiter"]),
    validate(jobSchema, 'body'), 
    createJob
);

// Get all jobs for a recruiter
router.get(
    '/',
    validate(accessSchema, 'headers'), 
    authenticate, 
    authorize(["recruiter"]),
    getAllJobs
);

// Get job by id
router.get(
    '/:id',
    validate(accessSchema, 'headers'),
    authenticate,
    getJob
);

// Update a job by id
router.put(
    '/:id',
    validate(accessSchema, 'headers'),
    authenticate,
    authorize(["recruiter"]),
    validate(jobSchema, 'body'),
    updateJob
);

// Close a job by id
router.patch(
    '/:id',
    validate(accessSchema, 'headers'),
    authenticate,
    authorize(["recruiter"]),
    closeJob
);


export default router;