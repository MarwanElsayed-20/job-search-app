import jwt from "jsonwebtoken";
import asyncHandler from "../../utils/asyncHandler.js";
import User from "../../../DB/models/user.model.js";
import Token from "../../../DB/models/token.model.js";
import sendEmail from "../../utils/sendEmail.js";
import { forgetCodeTemplate } from "../../utils/emailTemplates.js";

// signup controller
export const signup = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    recoveryMail,
    dateOfBirth,
    mobileNumber,
    role,
  } = req.body;

  // create user model
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    recoveryMail,
    dateOfBirth,
    mobileNumber,
  });

  // check if role provided to add it to user
  role ? (user.role = role) : user.role;
  await user.save();

  // send response
  return res.json({
    success: true,
    msg: "Account created successfully. check your email to activate your account.",
  });
});

// account activation controller
export const accountActivation = asyncHandler(async (req, res) => {
  // get email from token from params
  const email = jwt.verify(req.params.token, process.env.TOKEN_SECRET_KEY);

  // activate user
  await User.findOneAndUpdate({ email }, { isActive: true });

  // send response
  return res.json({ success: true, msg: "Account activated successfully." });
});

// login controller
export const login = asyncHandler(async (req, res) => {
  const {
    _id,
    firstName,
    lastName,
    userName,

    role,
    isActive,
  } = req.user;

  // change user status to online
  req.user.status = "online";
  await req.user.save();

  // generate token
  const token = jwt.sign(
    {
      _id,
      firstName,
      lastName,
      userName,
      role,
      isActive,
    },
    process.env.TOKEN_SECRET_KEY
  );

  // create token in token model
  await Token.create({ token, user: _id, agent: req.headers["user-agent"] });

  // send response
  return res.json({
    success: true,
    msg: "logged in successfully.",
    result: { token },
  });
});

// forget password controller
export const forgetPassword = asyncHandler(async (req, res) => {
  const user = req.user;
  const forgetCode = req.forgetCode;

  // send forget code via mail
  const emailResult = await sendEmail({
    to: user.email,
    subject: "Forget code.",
    html: forgetCodeTemplate(forgetCode),
  });

  if (!emailResult) {
    return next(
      new Error("Something went wrong, check your email and try again later.")
    );
  }

  // save forget code in DB and make it valid
  user.forgetCode.code = forgetCode;
  user.forgetCode.isValid = true;
  await user.save();

  // invalid the code in 10 minutes
  setTimeout(async () => {
    user.forgetCode.isValid = false;
    await user.save();
  }, 600000);

  // send response
  return res.json({
    success: true,
    msg: "Forget code sent to your email. will expire in 10 minutes.",
  });
});

// reset code controller
export const resetCode = asyncHandler(async (req, res) => {
  const user = req.user;

  // make code verified and make it invalid
  user.forgetCode.isVerified = true;
  user.forgetCode.isValid = false;
  await user.save();

  // send response
  return res.json({ success: true, msg: "You can change your password now." });
});

// change password controller
export const changePassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const user = req.user;

  // change password in DB and make code not verified any more
  user.password = password;
  user.forgetCode.isVerified = false;
  await user.save();

  // get user tokens
  const tokens = await Token.find({ user: user._id });

  // invalidate the user tokens if exist
  if (tokens) {
    tokens.map(async (token) => {
      token.isValid = false;
      await token.save();
    });
  }

  // send response
  return res.json({ success: true, msg: "Password changed successfully." });
});
