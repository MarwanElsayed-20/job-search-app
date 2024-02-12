import mongoose, { Schema, Types } from "mongoose";

const applicationSchema = new Schema(
  {
    jobId: { type: Types.ObjectId, ref: "Job", required: true },
    userId: { type: Types.ObjectId, ref: "User", required: true },
    userTechSkills: { type: [String], required: true, lowercase: true },
    userSoftSkills: { type: [String], required: true, lowercase: true },
    userResume: {
      url: { type: String, required: true },
      id: { type: String, required: true },
    },
    createdDay: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Application = mongoose.model("Application", applicationSchema);

export default Application;
