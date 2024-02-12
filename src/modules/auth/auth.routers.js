import { Router } from "express";
import { schemasValidation } from "../../middlewares/validation.middlewares.js";
import * as authSchemas from "../../validation/auth.schemas.js";
import * as authMiddlewares from "./auth.middlewares.js";
import * as authControllers from "./auth.controllers.js";

const authRouter = Router();

// register router
authRouter.post(
  "/signup",
  schemasValidation(authSchemas.signupSchema),
  authMiddlewares.isEmailsNotEqual,
  authMiddlewares.isEmailNotExist,
  authMiddlewares.isMobileNumberUnique,
  authMiddlewares.isActivationEmailSent,
  authControllers.signup
);

// account activation router
authRouter.get(
  "/account-activation/:token",
  schemasValidation(authSchemas.accountActivationSchema),
  authMiddlewares.isEmailExist,
  authControllers.accountActivation
);

// login router
authRouter.post(
  "/login",
  schemasValidation(authSchemas.loginSchema),
  authMiddlewares.isUserExist,
  authMiddlewares.isAccountActive,
  authControllers.login
);

// forget password router
authRouter.post(
  "/forget-password",
  schemasValidation(authSchemas.forgetPasswordSchema),
  authMiddlewares.isEmailExist,
  authMiddlewares.isForgeCodeUnique,
  authControllers.forgetPassword
);

// reset code router
authRouter.post(
  "/reset-code",
  schemasValidation(authSchemas.resetCodeSchema),
  authMiddlewares.isResetCodeValid,
  authControllers.resetCode
);

// change password router
authRouter.post(
  "/change-password",
  schemasValidation(authSchemas.changePasswordSchema),
  authMiddlewares.isEmailExist,
  authMiddlewares.isCodeVerified,
  authMiddlewares.isNewPasswordDifferent,
  authControllers.changePassword
);

export default authRouter;
