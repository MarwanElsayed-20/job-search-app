import jwt from "jsonwebtoken";
import asyncHandler from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloudinary.js";
import sendEmail from "../../utils/sendEmail.js";
import Token from "../../../DB/models/token.model.js";
import { signupActivationLinkTemplate } from "../../utils/emailTemplates.js";
import User from "../../../DB/models/user.model.js";
import Company from "../../../DB/models/company.model.js";
import Job from "../../../DB/models/job.model.js";
import Application from "../../../DB/models/application.model.js";

// change profile picture
export const addProfilePicture = asyncHandler(async (req, res) => {
  const user = req.user;

  // check if it is the default profile picture
  if (
    user.profilePicture.id === "JobSearchApp/DefaultImages/placeholder_sevjgu"
  ) {
    // upload picture in specific folder
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `JobSearchApp/users/${user._id}/profilePicture/`,
      }
    );

    user.profilePicture.url = secure_url;
    user.profilePicture.id = public_id;
  } else {
    // if not update the current picture
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      {
        public_id: user.profilePicture.id,
      }
    );

    user.profilePicture.url = secure_url;
    user.profilePicture.id = public_id;
  }

  await user.save();

  return res.json({ success: true, msg: "Profile picture added." });
});

// update user controller
export const updateUser = asyncHandler(async (req, res) => {
  const {
    email,
    mobileNumber,
    recoveryMail,
    dateOfBirth,
    firstName,
    lastName,
  } = req.body;
  const user = req.user;

  // check if receiving email or number
  if (email || mobileNumber) {
    // check if i have new email or email not changed
    const currentEmail = email || user.email;
    // create token to send activation email
    const token = jwt.sign(currentEmail, process.env.TOKEN_SECRET_KEY);

    // send email to either the old or new email if provided
    const emailResult = await sendEmail({
      to: currentEmail,
      subject: "Account activation",
      html: signupActivationLinkTemplate(
        `http://localhost:3000/auth/account-activation/${token}`
      ),
    });

    if (!emailResult) {
      return next(
        new Error("Something went wrong, check your email and try again later.")
      );
    }

    // change email if provided
    email ? (user.email = email) : (user.email = user.email);

    // change number if provided
    mobileNumber
      ? (user.mobileNumber = mobileNumber)
      : (user.mobileNumber = user.mobileNumber);

    // deactivate account and logout
    user.isActive = false;
    user.status = "offline";

    // make all token expired to make user login again
    const tokens = await Token.find({ user: req.user._id });

    tokens.map(async (token) => {
      token.isValid = false;
      await token.save();
    });
  }

  // change recovery mail if provided
  recoveryMail ? (user.recoveryMail = recoveryMail) : user.recoveryMail;

  // change DOB if provided
  dateOfBirth ? (user.dateOfBirth = dateOfBirth) : user.dateOfBirth;

  // change first name if provided
  firstName ? (user.firstName = firstName) : user.firstName;

  // change last name if provided
  lastName ? (user.lastName = lastName) : user.lastName;

  // update the document
  await user.save();

  // send response
  return res.json({
    success: true,
    msg: "User updated successfully. Check your email to re-activate your account. You need to login again",
  });
});

// delete user controller
export const deleteUser = asyncHandler(async (req, res) => {
  const user = req.user;

  // get user tokens and make them invalid
  const tokens = await Token.find({ user: user._id });

  tokens.map(async (token) => {
    token.isValid = false;
    await token.save();
  });

  // check if user has profilePicture
  if (
    user.profilePicture.id !== "JobSearchApp/DefaultImages/placeholder_sevjgu"
  ) {
    // delete image
    await cloudinary.uploader.destroy(user.profilePicture.id);
    // delete folder
    await cloudinary.api.delete_folder(`JobSearchApp/users/${user._id}/`);
  }

  if (user.role === "companyHR") {
    // delete user companies
    await Company.deleteMany({ companyHR: user._id });

    const jobs = await Job.find({ addedBy: user._id });
    const jobsId = jobs.map((job) => job._id);

    // delete user companies jobs applications
    await Application.deleteMany({ jobId: { $in: jobsId } });

    // delete user companies jobs
    await Job.deleteMany({ addedBy: user._id });
  }

  // delete user
  await User.findByIdAndDelete({ _id: user._id });

  // send response
  return res.json({ success: true, msg: "User deleted successfully." });
});

// get user controller
export const getUser = asyncHandler(async (req, res) => {
  return res.json({ success: true, result: { user: req.user } });
});

// get another user controller
export const getAnotherUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById({ _id: userId }).select(
    "firstName lastName userName role status profilePicture"
  );

  return res.json({ success: true, result: { user } });
});

// update password controller
export const updatePassword = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;
  const user = req.user;

  // change user status to make him logout and add the new password
  user.status = "offline";
  user.password = newPassword;
  await user.save();

  // get all user tokens and make them invalid
  const tokens = await Token.find({ user: user._id });

  tokens.map(async (token) => {
    token.isValid = false;
    await token.save();
  });

  // send response
  return res.json({
    success: true,
    msg: "Password changed successfully. try to login again",
  });
});

// recovery email controller
export const recoveryEmail = asyncHandler(async (req, res) => {
  const users = req.user;

  // get accounts email with same recovery email
  const accounts = users.map((user) => user.email);

  // send response
  return res.json({
    success: true,
    msg: "Emails with same recovery mail",
    result: accounts,
  });
});
