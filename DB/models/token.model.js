import mongoose, { Schema, Types } from "mongoose";

const tokenSchema = new Schema(
  {
    token: { type: String, required: true, unique: true },
    user: { type: Types.ObjectId, ref: "User", required: true },
    isValid: { type: Boolean, required: true, default: true },
    expiredAt: { type: String },
    agent: { type: String, required: true },
  },
  { timestamps: true }
);

const Token = mongoose.model("Token", tokenSchema);

export default Token;
