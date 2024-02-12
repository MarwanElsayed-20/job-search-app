import Joi from "joi";
import { isValidObjectId } from "../middlewares/validation.middlewares.js";

// update user schema
export const updateUserSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: true },
    })
    .messages({
      "string.base": "Email must be a string.",
      "string.empty": "Please enter your email address.",
      "string.email": "Please enter a valid email address.",
    }),
  mobileNumber: Joi.string()
    .regex(/^\+20(?:10|11|12|15)[0-9]{8}$/)
    .messages({
      "string.base": "Phone number must be a string",
      "string.empty": "Please enter your phone number",
      "string.pattern.base":
        "Invalid phone number format. It should start with +20 followed by 10, 11, 12, or 15, and then 8 additional digits.",
    }),
  recoveryMail: Joi.string().email().messages({
    "string.base": "Recovery email must be a string.",
    "string.empty": "Recovery email is required.",
    "string.email":
      "Invalid recovery email format. Please provide a valid email address.",
  }),
  dateOfBirth: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .messages({
      "string.base": "Date of birth must be a string.",
      "string.empty": "Date of birth is required.",
      "string.pattern.base":
        'Invalid date of birth format. Please use the format "YYYY-MM-DD".',
    }),
  firstName: Joi.string()
    .min(3)
    .max(20)
    .regex(/^[A-Za-z-']{3,20}$/)
    .message({
      "string.base": "First name must be a string.",
      "string.empty": "Please enter your first name.",
      "string.min": "First name must have at least {3} characters.",
      "string.max": "First name must have at most {20} characters.",
      "string.pattern.base":
        "Invalid characters in the first name. Only letters, hyphens, and apostrophes are allowed.",
    }),
  lastName: Joi.string()
    .min(3)
    .max(20)
    .regex(/^[A-Za-z-']{3,20}$/)
    .message({
      "string.base": "Last name must be a string.",
      "string.empty": "Please enter your last name.",
      "string.min": "Last name must have at least {3} characters.",
      "string.max": "Last name must have at most {20} characters.",
      "string.pattern.base":
        "Invalid characters in the last name. Only letters, hyphens, and apostrophes are allowed.",
    }),
}).required();

// get another user schema
export const getAnotherUserSchema = Joi.object({
  userId: Joi.string().custom(isValidObjectId).required(),
}).required();

// update password schema
export const updatePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .required()
    .messages({
      "string.base": "Password must be a string.",
      "string.empty": "Please enter a password.",
      "string.pattern.base":
        "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character (@ $ ! % * ? &).",
      "any.required": "Password is required.",
    }),
  newPassword: Joi.string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .required()
    .messages({
      "string.base": "Password must be a string.",
      "string.empty": "Please enter a password.",
      "string.pattern.base":
        "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character (@ $ ! % * ? &).",
      "any.required": "Password is required.",
    }),
  confirmedPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .strict()
    .label("Confirmed Password")
    .messages({
      "any.only": "Passwords do not match.",
      "any.required": "Confirmed password is required.",
    }),
}).required();

// get users with same recovery email
export const recoveryEmailSchema = Joi.object({
  recoveryMail: Joi.string().email().messages({
    "string.base": "Recovery email must be a string.",
    "string.empty": "Recovery email is required.",
    "string.email":
      "Invalid recovery email format. Please provide a valid email address.",
  }),
}).required();
