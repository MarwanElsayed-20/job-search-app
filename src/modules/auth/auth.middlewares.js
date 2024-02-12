import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import randomstring from "randomstring";
import User from "../../../DB/models/user.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { signupActivationLinkTemplate } from "../../utils/emailTemplates.js";
import sendEmail from "../../utils/sendEmail.js";

// check if email not the same as recovery email
export const isEmailsNotEqual = asyncHandler(async (req, res, next) => {
  const { email, recoveryMail } = req.body;
  if (email === recoveryMail) {
    return next(
      new Error("Email and recovery email cant be the same.", { cause: 409 })
    );
  }

  return next();
});

// check if email already exist
export const isEmailNotExist = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  // check if user registered before
  const user = await User.findOne({ email });
  if (user) {
    return next(new Error("Email already exist", { cause: 409 }));
  }

  return next();
});

// check if mobile number is unique
export const isMobileNumberUnique = asyncHandler(async (req, res, next) => {
  const { mobileNumber } = req.body;

  const user = await User.findOne({ mobileNumber });

  if (user) {
    return next(new Error("Number already used", { cause: 409 }));
  }

  return next();
});

// check if email sent
export const isActivationEmailSent = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  // generate token for activation link
  const token = jwt.sign(email, process.env.TOKEN_SECRET_KEY);

  // send email
  const emailResult = await sendEmail({
    to: email,
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

  return next();
});

// check if email exist
export const isEmailExist = asyncHandler(async (req, res, next) => {
  let email;
  const { token } = req.params;

  // check if token
  token // if yes get email from token
    ? (email = jwt.verify(token, process.env.TOKEN_SECRET_KEY)) // if not get email from body
    : (email = req.body.email);

  const user = await User.findOne({ email });

  if (!user) {
    return next(new Error("User not found.", { cause: 404 }));
  }
  req.user = user;
  return next();
});

// check if user exist
export const isUserExist = asyncHandler(async (req, res, next) => {
  const { emailOrNumber, password } = req.body;

  const user = await User.findOne({
    $or: [{ email: emailOrNumber }, { mobileNumber: emailOrNumber }],
  });

  if (!user) {
    return next(new Error("User not found.", { cause: 404 }));
  }

  const isPasswordMatch = bcrypt.compareSync(password, user.password);

  if (!isPasswordMatch) {
    return next(new Error("Password is wrong.", { cause: 401 }));
  }

  req.user = user;
  return next();
});

// check if account is active
export const isAccountActive = asyncHandler(async (req, res, next) => {
  const user = req.user;

  if (!user.isActive) {
    return next(
      new Error("You need to activate your account first.", { cause: 401 })
    );
  }

  return next();
});

// generate code and check if its unique
export const isForgeCodeUnique = asyncHandler(async (req, res, next) => {
  // generate code
  const forgetCode = randomstring.generate({
    length: 6,
    charset: "numeric",
  });

  // check if code already with another user
  const isCodeUnique = await User.find({ "forgetCode.code": forgetCode });

  if (isCodeUnique.length > 0) {
    return next(
      new Error("Forget code already exist try to generate another code.", {
        cause: 409,
      })
    );
  }

  // save forget code in req
  req.forgetCode = forgetCode;
  return next();
});

// check if reset code is exist and valid
export const isResetCodeValid = asyncHandler(async (req, res, next) => {
  const { resetCode } = req.body;

  // get user with this reset code
  const user = await User.findOne({ "forgetCode.code": resetCode });

  // check if reset code exist
  if (!user) {
    return next(new Error("Reset code not found.", { cause: 401 }));
  }

  // check if reset code valid
  if (!user.forgetCode.isValid) {
    return next(new Error("Reset code not valid.", { cause: 401 }));
  }

  req.user = user;
  return next();
});

// check if code isVerified
export const isCodeVerified = asyncHandler(async (req, res, next) => {
  const user = req.user;

  // check if code is not verified
  if (!user.forgetCode.isVerified) {
    return next(new Error("You need to generate code first.", { cause: 401 }));
  }

  return next();
});

// check if new password is same as the old password
export const isNewPasswordDifferent = asyncHandler(async (req, res, next) => {
  const { password } = req.body;
  const user = req.user;

  const isPasswordMatch = bcrypt.compareSync(password, user.password);

  if (isPasswordMatch) {
    return next(
      new Error("New password cant be same as old password", { cause: 400 })
    );
  }

  return next();
});
