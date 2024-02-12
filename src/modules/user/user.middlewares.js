import bcryptjs from "bcryptjs";
import User from "../../../DB/models/user.model.js";
import asyncHandler from "../../utils/asyncHandler.js";

// check if file provided
export const isFileProvided = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new Error("File not provided", { cause: 400 }));
  }
  return next();
});

// check if user email not exist
export const isEmailNotExist = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  // if new email provided check if it already exist
  if (email) {
    const user = await User.findOne({ email });

    if (user) {
      return next(new Error("Email already exist.", { cause: 409 }));
    }

    return next();
  }

  return next();
});

// check if mobile number not exist
export const isMobileNumberNotExist = asyncHandler(async (req, res, next) => {
  const { mobileNumber } = req.body;

  // if new number provided check if it already exist
  if (mobileNumber) {
    const user = await User.findOne({ mobileNumber });

    if (user) {
      return next(new Error("Mobile number already exist.", { cause: 409 }));
    }

    return next();
  }

  return next();
});

// check if current password is right
export const isCurrentPasswordRight = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const { currentPassword } = req.body;

  const user = await User.findById({ _id });

  const isPasswordMatch = bcryptjs.compareSync(currentPassword, user.password);

  if (!isPasswordMatch) {
    return next(new Error("Current password is wrong.", { cause: 401 }));
  }

  return next();
});

// check if recovery email is exist
export const isRecoveryEmailExist = asyncHandler(async (req, res, next) => {
  const { recoveryMail } = req.body;

  const users = await User.find({ recoveryMail });

  if (!users) {
    return next(new Error("Recovery email not found.", { cause: 404 }));
  }

  // if recovery mail exist save it in req
  req.user = users;
  return next();
});
