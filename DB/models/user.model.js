import bcrypt from "bcryptjs";
import mongoose, { Schema, Types } from "mongoose";

const userSchema = new Schema(
  {
    firstName: { type: String, required: true, minLength: 3, maxLength: 20 },
    lastName: { type: String, required: true, minLength: 3, maxLength: 20 },
    userName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    recoveryMail: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      minLength: 13,
      maxLength: 13,
    },
    role: {
      type: String,
      enum: ["user", "companyHR"],
      default: "user",
      required: true,
    },
    status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
      required: true,
    },
    isActive: { type: Boolean, required: true, default: "false" },
    profilePicture: {
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/dhfqfnml6/image/upload/v1706459125/JobSearchApp/DefaultImages/placeholder_sevjgu.jpg",
        required: true,
      },
      id: {
        type: String,
        default: "JobSearchApp/DefaultImages/placeholder_sevjgu",
        required: true,
      },
    },
    forgetCode: {
      code: {
        type: String,
        default: null,
        minlength: 6,
        maxLength: 6,
      },
      isValid: { type: Boolean, default: false },
      isVerified: { type: Boolean, default: false },
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// add userName dynamically from first and last name when ever user document got saved
userSchema.pre("save", function (next) {
  const firstName = this.firstName;
  const lastName = this.lastName;
  this.userName = `${firstName} ${lastName}`;

  next();
});

// hash password when ever password is made
userSchema.pre("save", function (next) {
  // check if password is present and is modified.
  try {
    if (this.password && this.isModified("password")) {
      this.password = bcrypt.hashSync(
        this.password,
        parseInt(process.env.SALT)
      );
    }
    next();
  } catch (err) {
    next(err);
  }
});

// add virtual company field
userSchema.virtual("company", {
  ref: "Company",
  localField: "_id",
  foreignField: "companyHR",
});

// add virtual job field
userSchema.virtual("job", {
  ref: "Job",
  localField: "_id",
  foreignField: "addedBy",
});

// add virtual application field
userSchema.virtual("application", {
  ref: "Application",
  localField: "_id",
  foreignField: "userId",
});

const User = mongoose.model("USer", userSchema);

export default User;
