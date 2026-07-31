import { Router } from 'express'
import { createJob, getMyJobs, getJob, updateJob, deleteJob, getJobs } from './job.controller.js';
import { validate } from '../../middleware/validate.js';
import { accessSchema } from "../auth/auth.schema.js";
import { authenticate } from "../../middleware/authenticate.js";
import { jobSchema } from "./job.schema.js";
import { authorize } from '../../middleware/authorize.js';

const router = Router();

// {Public Routes}
router.get(
    '/',
    getJobs
);

// {Recruiter Routes}
// Create a new job
router.post(
    '/', 
    validate(accessSchema, 'headers'), 
    authenticate, 
    authorize(["recruiter"]),
    validate(jobSchema, 'body'), 
    createJob
);

// {Recruiter Routes}
// Get all jobs for a recruiter
router.get(
    '/me',
    validate(accessSchema, 'headers'), 
    authenticate, 
    authorize(["recruiter"]),
    getMyJobs
);

// public route
router.get(
    '/:id',
    getJob
);

// {Recruiter Routes}
// Update a job by id
router.put(
    '/:id',
    validate(accessSchema, 'headers'),
    authenticate,
    authorize(["recruiter"]),
    validate(jobSchema, 'body'),
    updateJob
);

// {Recruiter Routes}
// Delete a job by id
router.delete(
    '/:id',
    validate(accessSchema, 'headers'),
    authenticate,
    authorize(["recruiter"]),
    deleteJob
);


export default router;