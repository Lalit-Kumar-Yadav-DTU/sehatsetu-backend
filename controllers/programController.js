import mongoose from 'mongoose'; // 👈 Added this!
import Program from '../models/Program.js';

// @desc    Fetch all programs
// @route   GET /api/programs
export const getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.find({});
    
    return res.status(200).json({
      success: true,
      data: programs,
    });
  } catch (error) {
    console.error("Error fetching programs:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch programs",
      error: error.message,
    });
  }
};

// @desc    Fetch a single program by ID (For the Course Details Page)
// @route   GET /api/programs/:id
export const getProgramById = async (req, res) => {
  try {
    // 🛡️ THE SHIELD: Check if it's a valid MongoDB ID first!
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Invalid Program ID format" });
    }

    // We keep the populate so your sections load!
    const program = await Program.findById(req.params.id).populate('courseContent');
    
    if (program) {
      // ✅ THE FIX: Returning the raw program directly to fix your Redux state!
      return res.status(200).json(program);
    } else {
      return res.status(404).json({ message: "Program not found" });
    }
  } catch (error) {
    console.error("Error fetching program:", error);
    return res.status(500).json({ message: "Server error fetching program" });
  }
};

// @desc    Get Full Program Details (Deep Populate for the Classroom/Video Player)
// @route   POST /api/programs/getFullProgramDetails
export const getFullProgramDetails = async (req, res) => {
  try {
    const { programId } = req.body;

    if (!programId) {
      return res.status(400).json({ success: false, message: "Program ID is required" });
    }

    // 🛡️ THE SHIELD: Prevent crash if ID is invalid
    if (!mongoose.Types.ObjectId.isValid(programId)) {
      return res.status(400).json({ success: false, message: "Invalid Program ID format" });
    }

    // 🛡️ THE DEEP POPULATE MAGIC 🛡️
    const programDetails = await Program.findById(programId)
      .populate({
        path: "courseContent", // Level 1: Open the Sections (e.g., "Week 1")
        populate: {
          path: "subSection",  // Level 2: Open the SubSections inside them (e.g., The Video files)
        },
      })
      .exec();

    if (!programDetails) {
      return res.status(404).json({ 
        success: false, 
        message: `Could not find program with id: ${programId}` 
      });
    }

    return res.status(200).json({
      success: true,
      data: programDetails,
    });

  } catch (error) {
    console.error("Error in Deep Populate:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error fetching course details",
      error: error.message 
    });
  }
};

// @desc    Create a brand new Course (Program)
// @route   POST /api/programs/createCourse
export const createCourse = async (req, res) => {
  try {
    // 1. Grab the data sent from the React form
    const { title, description, level, price, duration, tags } = req.body;

    // 2. Validate that the user didn't leave anything blank
    if (!title || !description || !price) {
      return res.status(400).json({ success: false, message: "Please fill all required fields" });
    }

    // 3. Create the Course in the Database!
    // (Mongoose will automatically add the empty courseContent: [] array here!)
    const newCourse = await Program.create({
      title,
      description,
      level: level || "Beginner",
      price,
      duration: duration || "TBD",
      tags: tags ? tags.split(',') : [], // Converts "yoga,health" into an array
      // NOTE: We will handle the Thumbnail Image upload later to keep this simple for now!
      image: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2", 
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully!",
      data: newCourse,
    });

  } catch (error) {
    console.error("Error creating course:", error);
    return res.status(500).json({ success: false, message: "Failed to create course", error: error.message });
  }
};