import Section from '../models/section.js';
import Program from '../models/Program.js';

export const createSection = async (req, res) => {
  try {
    // 1. Get data
    const { sectionName, programId } = req.body;

    // 2. Validate
    if (!sectionName || !programId) {
      return res.status(400).json({ success: false, message: "Missing required properties" });
    }

    // 3. Create the Section
    const newSection = await Section.create({ sectionName });

    // 4. Link the Section to the Program and POPULATE so the frontend gets the full updated list
    const updatedProgram = await Program.findByIdAndUpdate(
      programId,
      { $push: { courseContent: newSection._id } },
      { new: true }
    ).populate({
      path: "courseContent",
      populate: { path: "subSection" }
    }).exec();

    // 5. Return success
    res.status(200).json({
      success: true,
      message: "Section created successfully",
      updatedProgram,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to create Section", error: error.message });
  }
};