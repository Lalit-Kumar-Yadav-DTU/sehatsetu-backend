import mongoose from 'mongoose';

const subSectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  timeDuration: { type: String },
  description: { type: String },
  videoUrl: { type: String, required: true },
});

export default mongoose.model("subSection", subSectionSchema);
