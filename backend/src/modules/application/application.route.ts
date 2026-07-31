import { Router } from 'express';

import { validate } from '../../middleware/validate.js';
import { accessSchema } from '../auth/auth.schema.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { applyJobSchema, updateApplicationStatusSchema } from './application.schema.js';
import { applyJob, getMyApplications, getApplicants, updateApplicationStatus, getApplicationDetail, getRecruiterDashboardApplications } from './application.controller.js';

const router = Router();

// Candidate applies to a job
router.post(
    '/',
    validate(accessSchema, "headers"),
    authenticate,
    authorize(["candidate"]),
    validate(applyJobSchema, "body"),
    applyJob
);

// Get applications
router.get(
    '/me',
    validate(accessSchema, "headers"),
    authenticate,
    authorize(["candidate"]),
    getMyApplications
);

// Recruiter views applicants for a job
router.get(
    '/job/:jobId',
    validate(accessSchema, "headers"),
    authenticate,
    authorize(["recruiter"]),
    getApplicants
);

// Recruiter updates an application's status
router.patch(
    '/:id/status',
    validate(accessSchema, "headers"),
    authenticate,
    authorize(["recruiter"]),
    validate(updateApplicationStatusSchema, "body"),
    updateApplicationStatus
);

router.get(
    '/:id',
    validate(accessSchema, "headers"),
    authenticate,
    authorize(["recruiter"]),
    getApplicationDetail
);

router.get(
    '/recruiter/recent',
    validate(accessSchema, "headers"),
    authenticate,
    authorize(["recruiter"]),
    getRecruiterDashboardApplications
);

export default router;