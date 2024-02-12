import Router from "express";
import { isAuthenticated } from "../../middlewares/isAuthenticated.middleware.js";
import { schemasValidation } from "../../middlewares/validation.middlewares.js";
import fileUpload, { fileValidation } from "../../utils/fileUpload.js";
import * as userMiddlewares from "./user.middlewares.js";
import * as userControllers from "./user.controllers.js";
import * as userSchemas from "../../validation/user.schemas.js";

const userRouter = Router();

// change profile picture router
userRouter.patch(
  "/profile-picture",
  isAuthenticated,
  fileUpload(fileValidation.images).single("profilePicture"),
  userMiddlewares.isFileProvided,
  userControllers.addProfilePicture
);

// update user router
userRouter.put(
  "/",
  isAuthenticated,
  schemasValidation(userSchemas.updateUserSchema),
  userMiddlewares.isEmailNotExist,
  userMiddlewares.isMobileNumberNotExist,
  userControllers.updateUser
);

// delete user router
userRouter.delete("/", isAuthenticated, userControllers.deleteUser);

// get user router
userRouter.get("/", isAuthenticated, userControllers.getUser);

// get another user router
userRouter.get(
  "/:userId",
  schemasValidation(userSchemas.getAnotherUserSchema),
  userControllers.getAnotherUser
);

// update password router
userRouter.patch(
  "/update-password",
  isAuthenticated,
  schemasValidation(userSchemas.updatePasswordSchema),
  userMiddlewares.isCurrentPasswordRight,
  userControllers.updatePassword
);

// get users with same recovery email
userRouter.post(
  "/with-same-recovery-email",
  schemasValidation(userSchemas.recoveryEmailSchema),
  userMiddlewares.isRecoveryEmailExist,
  userControllers.recoveryEmail
);

export default userRouter;
