import express from 'express';
import { checkout, paymentVerification, getKey } from '../controllers/paymentController.js';
import { getFullProgramDetails } from '../controllers/programController.js';

const router = express.Router();

router.post('/checkout', checkout);
router.post('/paymentverification', paymentVerification);
router.get('/getkey', getKey);
router.post('/getFullProgramDetails', getFullProgramDetails);

export default router;