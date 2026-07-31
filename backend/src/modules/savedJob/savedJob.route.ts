import { Router } from 'express'

import { validate } from '../../middleware/validate.js'
import { accessSchema } from '../auth/auth.schema.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { getSavedJobs, removeSavedJob, saveJob } from './savedJob.controller.js';


const router = Router();

router.post(
    '/:jobId',
    validate(accessSchema, "headers"),
    authenticate,
    authorize(["candidate"]),
    saveJob
);

router.get(
    '/',
    validate(accessSchema, "headers"),
    authenticate,
    authorize(["candidate"]),
    getSavedJobs
);

router.delete(
    '/:jobId',
    validate(accessSchema, "headers"),
    authenticate,
    authorize(["candidate"]),
    removeSavedJob
);

export default router;