import Joi from "joi";
import { isValidObjectId } from "../middlewares/validation.middlewares.js";

// add company schema
export const addCompany = Joi.object({
  companyName: Joi.string().min(1).max(50).required().messages({
    "string.base": "Company name must be a string.",
    "string.empty": "Company name is required.",
    "string.min": "Company name must have at least 1 character.",
    "string.max": "Company name must have at most 50 characters.",
    "any.required": "Company name is required.",
  }),
  description: Joi.string().min(10).max(200).required().messages({
    "string.base": "Description must be a string.",
    "string.empty": "Description is required.",
    "string.min": "Description must have at least 10 characters.",
    "string.max": "Description must have at most 200 characters.",
    "any.required": "Description is required.",
  }),
  industry: Joi.string().required().messages({
    "string.base": "Industry must be a string.",
    "string.empty": "Industry is required.",
    "any.required": "Industry is required.",
  }),
  address: Joi.string().min(5).max(100).required().messages({
    "string.base": "Address must be a string.",
    "string.empty": "Address is required.",
    "string.min": "Address must have at least 5 characters.",
    "string.max": "Address must have at most 100 characters.",

    "any.required": "Address is required.",
  }),
  numberOfEmployees: Joi.string()
    .valid("1-10", "11-20", "21-50", "51-100", "501+")
    .required()
    .messages({
      "any.only":
        'Invalid number of employees. Allowed values are "1-10", "11-20", "21-50", "51-100", "501+".',
      "any.required": "Number of employees is required.",
    }),
  companyEmail: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: true },
    })
    .required()
    .messages({
      "string.base": "Company email must be a string.",
      "string.empty": "Company email is required.",
      "string.email":
        "Invalid company email format. Please provide a valid email address.",
      "any.required": "Company email is required.",
    }),
}).required();

// add company photo
export const addCompanyPhotoSchema = Joi.object({
  companyId: Joi.string().custom(isValidObjectId).required(),
}).required();

// update company schema
export const updateCompanySchema = Joi.object({
  companyId: Joi.string().custom(isValidObjectId).required(),
  companyName: Joi.string().min(1).max(50).messages({
    "string.base": "Company name must be a string.",
    "string.empty": "Company name is required.",
    "string.min": "Company name must have at least 1 character.",
    "string.max": "Company name must have at most 50 characters.",
  }),
  description: Joi.string().min(10).max(200).messages({
    "string.base": "Description must be a string.",
    "string.empty": "Description is required.",
    "string.min": "Description must have at least 10 characters.",
    "string.max": "Description must have at most 200 characters.",
  }),
  industry: Joi.string().messages({
    "string.base": "Industry must be a string.",
    "string.empty": "Industry is required.",
  }),
  address: Joi.string().min(5).max(100).messages({
    "string.base": "Address must be a string.",
    "string.empty": "Address is required.",
    "string.min": "Address must have at least 5 characters.",
    "string.max": "Address must have at most 100 characters.",
  }),
  numberOfEmployees: Joi.string()
    .valid("1-10", "11-20", "21-50", "51-100", "501+")
    .messages({
      "any.only":
        'Invalid number of employees. Allowed values are "1-10", "11-20", "21-50", "51-100", "501+".',
    }),
  companyEmail: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: true },
    })
    .messages({
      "string.base": "Company email must be a string.",
      "string.empty": "Company email is required.",
      "string.email":
        "Invalid company email format. Please provide a valid email address.",
    }),
}).required();

// delete company schema
export const deleteCompanySchema = Joi.object({
  companyId: Joi.string().custom(isValidObjectId).required(),
}).required();

// get company schema
export const getCompanySchema = Joi.object({
  companyId: Joi.string().custom(isValidObjectId).required(),
}).required();

// search company by name schema
export const searchCompanyByNameSchema = Joi.object({
  companyName: Joi.string().min(1).max(50).required().messages({
    "string.base": "Company name must be a string.",
    "string.empty": "Company name is required.",
    "string.min": "Company name must have at least 1 character.",
    "string.max": "Company name must have at most 50 characters.",
    "any.required": "Company name is required.",
  }),
}).required();

// get all application for company job schema
export const getAllCompanyJobApplicationsSchema = Joi.object({
  companyId: Joi.string().custom(isValidObjectId).required(),
  jobId: Joi.string().custom(isValidObjectId).required(),
}).required();

// get applications for specific company filtered by day schema
export const getCompanyJobsApplicationByDaySchema = Joi.object({
  companyId: Joi.string().custom(isValidObjectId).required(),
  day: Joi.string()
    .pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[01])$/)
    .required()
    .messages({
      "string.base": "Day must be a string.",
      "string.empty": "Day is required.",
      "string.pattern.base":
        'Invalid day format. Please use the format "YYYY-MM-DD" with two-digit month and day.',
      "any.required": "Day is required.",
    }),
}).required();
