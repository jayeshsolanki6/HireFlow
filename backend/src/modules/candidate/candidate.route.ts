import { Router } from 'express'

import { validate } from '../../middleware/validate.js'
import { accessSchema } from '../auth/auth.schema.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { profileSchema } from './candidate.schema.js';
import { upload } from '../../middleware/upload.js'
import { analyseForCandidate, getProfile, updateProfile } from './candidate.controller.js';

const router = Router();

// update candidate profile
router.post(
    '/profile',
    validate(accessSchema, "headers"),
    authenticate,
    authorize(["candidate"]),
    upload.fields([
        {name: "profileImage", maxCount: 1},
        {name: "resume", maxCount: 1}
    ]),
    validate(profileSchema, "body"),
    updateProfile
);

// get candidate profile
router.get(
    '/profile',
    validate(accessSchema, "headers"),
    authenticate,
    authorize(["candidate"]),
    getProfile
);

// analyze candidate application for a specific job
router.post(
    '/job/:jobId/analyze',
    validate(accessSchema, "headers"),
    authenticate,
    authorize(["candidate"]),
    analyseForCandidate
);

export default router;