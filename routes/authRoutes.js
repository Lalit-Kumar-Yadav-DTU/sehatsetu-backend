import express from 'express';
import { 
  registerUser, 
  loginUser, 
  verifyEmail, 
  forgotPassword, // 👈 Import it
  resetPassword   // 👈 Import it
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify/:token', verifyEmail);

// 👇 Add the two new routes 👇
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:token', resetPassword);

export default router;