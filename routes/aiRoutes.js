import express from 'express';
import { generateWellnessPlan } from '../controllers/aiController.js';
const router = express.Router();

router.post('/generate-plan', generateWellnessPlan);

export default router;