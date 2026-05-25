import { v2 as cloudinary } from 'cloudinary';

export const uploadImageToCloudinary = async (file, folder) => {
    const options = { 
        folder: folder,
        resource_type: "auto" // Auto-detects if it's a video or image
    };
    
    // Using standard upload guarantees the secure_url is returned immediately!
    return await cloudinary.uploader.upload(file.tempFilePath, options);
};