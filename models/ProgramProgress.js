import mongoose from 'mongoose';

const programProgressSchema = new mongoose.Schema({
  programID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Program",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  completedVideos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSection",
    },
  ],
});

export default mongoose.model("ProgramProgress", programProgressSchema);