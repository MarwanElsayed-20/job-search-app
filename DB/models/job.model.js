import mongoose, { Schema, Types } from "mongoose";
import User from "./user.model.js";

// function to validate if user role is companyHR
async function validateCompanyHR(userId) {
  const user = await User.findById({ _id: userId });
  if (!user || user.role !== "companyHR") {
    throw new Error("User role must be companyHR.");
  }
  return userId;
}

const jobSchema = new Schema(
  {
    jobTitle: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
      lowercase: true,
    },
    jobLocation: {
      type: String,
      enum: ["onsite", "remotely", "hybrid"],
      required: true,
    },
    workingTime: {
      type: String,
      enum: ["part-time", "full-time"],
      required: true,
    },
    seniorityLevel: {
      type: String,
      enum: ["junior", "mid-Level", "senior", "team-Lead", "CTO"],
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
      minLength: 10,
    },
    technicalSkills: { type: [String], required: true, lowercase: true },
    softSkills: { type: [String], required: true, lowercase: true },
    addedBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      validate: {
        validator: validateCompanyHR,
      },
    },
    company: { type: Types.ObjectId, ref: "Company", required: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// add jobs to the user who created it
jobSchema.pre("save", async function (next) {
  try {
    if (this.addedBy && this.isModified("addedBy")) {
      await User.findByIdAndUpdate(
        { _id: this.addedBy },
        { $push: { job: this._id } }
      );
    }
    next();
  } catch (err) {
    next(err);
  }
});

// add job applications as a virtual field
jobSchema.virtual("application", {
  ref: "Application",
  localField: "_id",
  foreignField: "jobId",
});

const Job = mongoose.model("Job", jobSchema);

export default Job;
