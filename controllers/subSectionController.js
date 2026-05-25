import subSection from '../models/subSection.js';
import Section from '../models/section.js';
import { uploadImageToCloudinary } from '../utils/imageUploader.js';
import dotenv from 'dotenv';
dotenv.config();

export const createSubSection = async (req, res) => {
  try {
    // 1. Get the text data
    const { sectionId, title, timeDuration, description } = req.body;
    
    // 2. Get the physical video file from the request
    const video = req.files?.video;

    // 3. Validate
    if (!sectionId || !title || !description || !video) {
      return res.status(400).json({ success: false, message: "All fields and a video file are required" });
    }

    // 4. Upload the video to Cloudinary
    console.log("Uploading video to Cloudinary... Please wait.");
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME || "SehatSetu_Videos"
    );
    console.log("Upload successful! Secure URL:", uploadDetails.secure_url);

    // 5. Create the SubSection (The Video object) in MongoDB
    const subSectionDetails = await SubSection.create({
      title,
      timeDuration: timeDuration || `${Math.floor(uploadDetails.duration / 60)} mins`,
      description,
      videoUrl: uploadDetails.secure_url, // Save the actual Cloudinary link!
    });

    // 6. Link the Video to the specific Section
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { $push: { subSection: subSectionDetails._id } },
      { new: true }
    ).populate("subSection").exec();

    // 7. Return success
    return res.status(200).json({
      success: true,
      message: "Video uploaded and SubSection created successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.error("Error creating new sub-section:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};