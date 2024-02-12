import jwt from "jsonwebtoken";
import Token from "../../DB/models/token.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../../DB/models/user.model.js";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  let { token } = req.headers;

  // check if token provided
  if (!token) {
    return next(new Error("Token not provided.", { cause: 401 }));
  }

  // check if token start with bearer key
  if (!token.startsWith(process.env.BEARER_KEY)) {
    return next(
      new Error("Token must start with the bearer key.", { cause: 401 })
    );
  }

  // remove bearer key from token
  token = token.split(process.env.BEARER_KEY)[1];

  const isTokenValid = await Token.findOne({ token });

  // check if token exist
  if (!isTokenValid) {
    return next(new Error("Token not found.", { cause: 404 }));
  }

  // check if token is valid
  if (!isTokenValid.isValid) {
    return next(new Error("Token expired.", { cause: 401 }));
  }

  // get data from token
  const payload = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

  // get user
  const user = await User.findById({ _id: payload._id }).select(
    "firstName lastName userName email recoveryMail dateOfBirth role status isActive profilePicture"
  );

  // check if user exist
  if (!user) {
    return next(new Error("User not found.", { cause: 404 }));
  }

  // check if user is active
  if (!user.isActive) {
    return next(new Error("User not active.", { cause: 403 }));
  }

  // check if user online
  if (user.status === "offline") {
    return next(
      new Error("User not online. you need to login again.", { cause: 403 })
    );
  }

  req.user = user;
  return next();
});
