import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import { v2 as cloudinary } from 'cloudinary';

import authRoutes from './routes/authRoutes.js';
import programRoutes from './routes/programRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config();

// 👇 PLUG IN CLOUDINARY CREDENTIALS 👇
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const app = express(); // <-- Only declared once here

// 👇 THE FIX: Explicitly tell the backend to trust your React frontend
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://127.0.0.1:5173',
    'https://sehatsetu-frontend.onrender.com' 
  ],
  credentials: true 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp", // This is perfect for Render deployments
  })
);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log("MongoDB Connection Error: ", err));

app.use('/api/auth', authRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/payment', paymentRoutes); 

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
