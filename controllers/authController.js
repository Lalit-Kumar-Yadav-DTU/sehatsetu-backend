import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';

export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, accountType } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ firstName, lastName, email, password, accountType });

    if (user) {
      const verificationToken = crypto.randomBytes(20).toString('hex');
      user.verificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
      user.verificationExpire = Date.now() + 24 * 60 * 60 * 1000; 
      await user.save();

      const backendUrl = process.env.BACKEND_URL || 'https://sehatsetu-api.onrender.com' || 'http://localhost:5000';
      const verifyUrl = `${backendUrl}/api/auth/verify/${verificationToken}`;
      const message = `
        <div style="font-family: Arial; padding: 20px;">
          <h1>Welcome to SehatSetu! 🌿</h1>
          <p>Click below to verify your account:</p>
          <a href="${verifyUrl}" style="background: #15803d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Account</a>
        </div>`;

      const recipientList = [user.email, 'rajat.s.official06@gmail.com'].join(', ');

      try {
        console.log("⏳ Attempting to send email to:", recipientList);
        await sendEmail({ email: recipientList, subject: 'Verify Account', message });
        
        console.log("✅ Email sent successfully!");
        res.status(201).json({ message: 'Check your email to verify account!' });
      } catch (emailError) {
        console.error("🔥 EMAIL FAILED! Reason:", emailError); 
        
        console.log("🗑️ Attempting to delete trapped user from database...");
        await User.findByIdAndDelete(user._id);
        console.log("✅ Trapped user deleted successfully.");

        return res.status(500).json({ message: 'Email could not be sent. Please try registering again.' });
      }
    } // 👈 THIS WAS MISSING
  } catch (error) { // 👈 THIS WAS MISSING
    res.status(500).json({ message: error.message }); // 👈 THIS WAS MISSING
  } // 👈 THIS WAS MISSING
};

export const verifyEmail = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ verificationToken: hashedToken, verificationExpire: { $gt: Date.now() } });

    if (!user) return res.status(400).json({ message: 'Invalid/Expired link' });

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpire = undefined;
    await user.save();

    res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate('purchasedPrograms');

    if (user && (await user.matchPassword(password))) {
      if (!user.isVerified) return res.status(401).json({ message: 'Please verify email first!' });
      res.json({ _id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, accountType: user.accountType, purchasedPrograms: user.purchasedPrograms, token: generateToken(user._id) });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// OTP FUNCTION FOR POSTMAN TESTS
// ==========================================

export const sendOtp = async (req, res) => {
  try {
    const { emails } = req.body; 

    if (!emails || emails.length === 0) {
      return res.status(400).json({ success: false, message: "Please provide at least one email." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const recipientList = emails.join(', ');

    const message = `
      <div style="font-family: Arial; padding: 20px;">
        <h1 style="color: #15803d;">Your SehatSetu OTP 🌿</h1>
        <p>Use the code below to complete your verification process:</p>
        <h2 style="background: #eee; padding: 10px; text-align: center; letter-spacing: 5px;">${otp}</h2>
        <p>This code is valid for 5 minutes.</p>
      </div>
    `;

    await sendEmail({
      email: recipientList,
      subject: 'SehatSetu - Your OTP Code',
      message: message,
    });

    res.status(200).json({ success: true, message: 'OTP sent successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// PASSWORD RECOVERY FUNCTIONS
// ==========================================

export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: 'There is no user with that email address.' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; 
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `
      <div style="font-family: Arial; padding: 20px;">
        <h1 style="color: #15803d;">Password Reset Request 🔐</h1>
        <p>You are receiving this email because you requested a password reset for your SehatSetu account.</p>
        <p>Please click the button below to set a new password:</p>
        <div style="margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #15803d; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p>If you did not request this, please ignore this email.</p>
        <p style="color: #999;">This link will expire in 10 minutes.</p>
      </div>
    `;

    try {
      const recipientList = [user.email, 'rajat.s.official06@gmail.com'].join(', ');

      await sendEmail({
        email: recipientList,
        subject: 'SehatSetu - Password Reset Request',
        message: message,
      });

      res.status(200).json({ message: 'Email sent successfully!' });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset link. Please request a new one.' });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful! You can now log in.' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
