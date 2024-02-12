import Joi from "joi";

// signup schema
export const signupSchema = Joi.object({
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
      "any.required": "First name is required.",
    })
    .required(),
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
      "any.required": "Last name is required.",
    })
    .required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: true },
    })
    .required()
    .messages({
      "string.base": "Email must be a string.",
      "string.empty": "Please enter your email address.",
      "string.email": "Please enter a valid email address.",
      "any.required": "Email is required.",
    }),
  password: Joi.string()
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
    .valid(Joi.ref("password"))
    .required()
    .strict()
    .label("Confirmed Password")
    .messages({
      "any.only": "Passwords do not match.",
      "any.required": "Confirmed password is required.",
    }),
  recoveryMail: Joi.string().email().required().messages({
    "string.base": "Recovery email must be a string.",
    "string.empty": "Recovery email is required.",
    "string.email":
      "Invalid recovery email format. Please provide a valid email address.",
    "any.required": "Email is required.",
  }),
  dateOfBirth: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      "string.base": "Date of birth must be a string.",
      "string.empty": "Date of birth is required.",
      "string.pattern.base":
        'Invalid date of birth format. Please use the format "YYYY-MM-DD".',
      "any.required": "Date of birth is required.",
    }),
  mobileNumber: Joi.string()
    .regex(/^\+20(?:10|11|12|15)[0-9]{8}$/)
    .required()
    .messages({
      "string.base": "Phone number must be a string",
      "string.empty": "Please enter your phone number",
      "string.pattern.base":
        "Invalid phone number format. It should start with +20 followed by 10, 11, 12, or 15, and then 8 additional digits.",
      "any.required": "Phone number is required",
    }),
  role: Joi.string().valid("user", "companyHR").messages({
    "string.base": "Role must be a string.",
    "string.empty": "Role is required.",
    "any.only": 'Invalid role. Allowed values are "user" or "companyHR".',
  }),
}).required();

// account activation schema
export const accountActivationSchema = Joi.object({
  token: Joi.string().required(),
}).required();

// login schema
export const loginSchema = Joi.object({
  emailOrNumber: Joi.alternatives()
    .try(
      Joi.string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: true },
        })
        .required()
        .messages({
          "string.base": "Email must be a string.",
          "string.empty": "Please enter your email address.",
          "string.email": "Please enter a valid email address.",
          "any.required": "Email is required.",
        }),
      Joi.string()
        .regex(/^\+20(?:10|11|12|15)[0-9]{8}$/)
        .required()
        .messages({
          "string.base": "Phone number must be a string",
          "string.empty": "Please enter your phone number",
          "string.pattern.base":
            "Invalid phone number format. It should start with +20 followed by 10, 11, 12, or 15, and then 8 additional digits.",
          "any.required": "Phone number is required",
        })
    )
    .messages({
      "alternatives.try":
        "Invalid login identifier. Please provide a valid email address or mobile number.",
      "any.required": "Login identifier is required.",
    }),
  password: Joi.string()
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
}).required();

// forget password schema
export const forgetPasswordSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: true },
    })
    .required()
    .messages({
      "string.base": "Email must be a string.",
      "string.empty": "Please enter your email address.",
      "string.email": "Please enter a valid email address.",
      "any.required": "Email is required.",
    }),
}).required();

// reset code schema
export const resetCodeSchema = Joi.object({
  resetCode: Joi.string()
    .regex(/^\d{6}$/)
    .required()
    .messages({
      "string.base": "Reset code must be a string.",
      "string.empty": "Reset code is required.",
      "string.pattern.base":
        "Invalid reset code format. Please provide a six-digit code.",
      "any.required": "Reset code is required.",
    }),
}).required();

// change password schema
export const changePasswordSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: true },
    })
    .required()
    .messages({
      "string.base": "Email must be a string.",
      "string.empty": "Please enter your email address.",
      "string.email": "Please enter a valid email address.",
      "any.required": "Email is required.",
    }),
  password: Joi.string()
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
    .valid(Joi.ref("password"))
    .required()
    .strict()
    .label("Confirmed Password")
    .messages({
      "any.only": "Passwords do not match.",
      "any.required": "Confirmed password is required.",
    }),
}).required();
