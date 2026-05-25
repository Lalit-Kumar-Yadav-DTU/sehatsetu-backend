import User from '../models/User.js'; 
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

// Create a shared instance so both checkout and verification can use it
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const checkout = async (req, res) => {
  try {
    console.log("📦 PACKAGE FROM REACT:", req.body);

    const { amount, userId, programId } = req.body;

    // 🛡️ SECURITY SHIELD: Check if user already owns this program
    const user = await User.findById(userId);
    if (user.purchasedPrograms.includes(programId)) {
      return res.status(400).json({ 
        success: false, 
        message: "You have already purchased this program." 
      });
    }

    const options = {
      amount: Number(amount) * 100, // Amount in paise
      currency: "INR",
      notes: {
        userId: userId,
        programId: programId
      }
    };

    const order = await instance.orders.create(options);
    
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Payment creation failed" });
  }
};

export const paymentVerification = async (req, res) => {
  console.log("💳 RAZORPAY VERIFICATION HIT!");
  
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Check if any fields are missing
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
       console.error("❌ ERROR: Missing payment details from Razorpay");
       return res.status(400).json({ success: false, message: "Missing payment details from Razorpay" });
    }

    // 1. Verify the signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      console.log("✅ Signature Verified. Fetching order notes...");

      // 2. Fetch the order to get the hidden notes (userId and programId)
      const order = await instance.orders.fetch(razorpay_order_id);
      const userId = order.notes.userId;
      const programId = order.notes.programId;

      console.log(`👤 Found User ID: ${userId}`);
      console.log(`📦 Found Program ID: ${programId}`);

      if (!userId || !programId) {
        console.error("❌ ERROR: User ID or Program ID is missing from Razorpay notes!");
        // 👇 CHANGED FROM REDIRECT TO JSON 👇
        return res.status(400).json({ success: false, message: "Payment tracking failed. Please contact support." });
      }

      // 3. FORCE DATABASE UPDATE ($addToSet prevents duplicate entries)
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { purchasedPrograms: programId } },
        { new: true } // Returns the newly updated document
      );

      if (updatedUser) {
        console.log("💾 Database successfully updated! User now owns:", updatedUser.purchasedPrograms);
      } else {
        console.error("❌ ERROR: Could not find user in database to update!");
      }

      // 4. 👇 CHANGED FROM REDIRECT TO JSON 👇
      // This tells Axios on the frontend that everything worked perfectly!
      res.status(200).json({ 
        success: true, 
        message: "Payment verified successfully!" 
      });

    } else {
      console.error("❌ ERROR: Signature Mismatch - Possible tampering!");
      // 👇 CHANGED RAW TEXT TO JSON 👇
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error("💥 CATASTROPHIC ERROR IN VERIFICATION:", error);
    res.status(500).json({ success: false, message: "Server error during verification" });
  }
};

export const getKey = (req, res) => {
  res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
};