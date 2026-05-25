import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Program from './models/Program.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const programs = [
  {
    title: "Gentle Yoga for Diabetes Management",
    description: "A therapeutic yoga program designed specifically for managing blood sugar levels through gentle movements, breathing exercises, and meditation.",
    tags: ["diabetes", "hypertension"],
    level: "Beginner",
    rating: 4.8,
    reviews: 124,
    enrolled: 458,
    duration: "8 weeks",
    price: 2499,
    image: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Joint Mobility & Flexibility Program",
    description: "Improve joint health and reduce pain with specialized exercises designed for seniors with arthritis and joint pain.",
    tags: ["joint pain", "chronic pain"],
    level: "Beginner",
    rating: 4.9,
    reviews: 89,
    enrolled: 312,
    duration: "6 weeks",
    price: 1999,
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Breathing Exercises for Respiratory Health",
    description: "Strengthen your lungs and improve breathing capacity with guided pranayama and breathing techniques.",
    tags: ["respiratory"],
    level: "Beginner",
    rating: 4.7,
    reviews: 67,
    enrolled: 234,
    duration: "4 weeks",
    price: 1499,
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Balance & Fall Prevention Training",
    description: "Build strength and stability to prevent falls and maintain independence with targeted balance exercises.",
    tags: ["balance", "post operative"],
    level: "Intermediate",
    rating: 4.9,
    reviews: 156,
    enrolled: 521,
    duration: "10 weeks",
    price: 2999,
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80"
  }
];

const importData = async () => {
  try {
    await Program.deleteMany();
    await Program.insertMany(programs);
    console.log("Data Imported successfully!");
    process.exit();
  } catch (error) {
    console.error("Error with data import", error);
    process.exit(1);
  }
};

importData();