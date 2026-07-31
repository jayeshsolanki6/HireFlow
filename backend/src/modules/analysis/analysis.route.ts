import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { accessSchema } from '../auth/auth.schema.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { analyzeAllForJob, analyzeSingle, getAnalysis } from './analysis.controller.js';

const router = Router();

router.post(
    '/job/:jobId/analyze-all', 
    validate(accessSchema, "headers"), 
    authenticate, 
    authorize(["recruiter"]), 
    analyzeAllForJob
);

router.post(
    '/application/:applicationId/analyze', 
    validate(accessSchema, "headers"), 
    authenticate, 
    authorize(["recruiter"]), 
    analyzeSingle
);

router.get(
    '/application/:applicationId', 
    validate(accessSchema, "headers"), 
    authenticate, 
    authorize(["recruiter"]), 
    getAnalysis
);

export default router;