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

// company schema
const companySchema = new Schema(
  {
    companyName: {
      type: String,
      required: true,
      unique: true,
      minLength: 1,
      maxLength: 50,
      trim: true,
    },
    companySlug: {
      type: String,
      unique: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
      minLength: 10,
      maxLength: 200,
    },
    companyPhoto: {
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/dhfqfnml6/image/upload/v1706735044/JobSearchApp/DefaultImages/default_rgkasn.png",
        required: true,
      },
      id: {
        type: String,
        default: "JobSearchApp/DefaultImages/default_rgkasn",
        required: true,
      },
    },
    industry: { type: String, required: true },
    address: { type: String, required: true, minLength: 5, maxLength: 100 },
    numberOfEmployees: {
      type: String,
      required: true,
      enum: ["1-10", "11-20", "21-50", "51-100", "501+"],
    },
    companyEmail: { type: String, required: true, unique: true },
    companyHR: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      validate: {
        validator: validateCompanyHR,
      },
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// make virtual relation with job
companySchema.virtual("job", {
  ref: "Job",
  localField: "_id",
  foreignField: "company",
});

const Company = mongoose.model("Company", companySchema);

export default Company;
