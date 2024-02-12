import Joi from "joi";
import { isValidObjectId } from "../middlewares/validation.middlewares.js";

// add job schema
export const addJobSchema = Joi.object({
  companyId: Joi.string().custom(isValidObjectId).required(),
  jobTitle: Joi.string().min(3).max(50).required().messages({
    "string.base": "Job title must be a string.",
    "string.empty": "Job title is required.",
    "string.min": "Job title must have at least 3 characters.",
    "string.max": "Job title must have at most 50 characters.",
    "any.required": "Job title is required.",
  }),
  jobLocation: Joi.string()
    .valid("onsite", "remotely", "hybrid")
    .insensitive()
    .required()
    .messages({
      "any.only":
        'Invalid job location. Allowed values are "onsite", "remotely", "hybrid".',
      "any.required": "Job location is required.",
    }),
  workingTime: Joi.string()
    .valid("part-time", "full-time")
    .insensitive()
    .required()
    .messages({
      "any.only":
        'Invalid working time. Allowed values are "part-time", "full-time".',
      "any.required": "Working time is required.",
    }),
  seniorityLevel: Joi.string()
    .valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO")
    .insensitive()
    .required()
    .messages({
      "any.only":
        'Invalid seniority level. Allowed values are "Junior", "Mid-Level", "Senior", "Team-Lead", "CTO".',
      "any.required": "Seniority level is required.",
    }),
  jobDescription: Joi.string().min(10).required().messages({
    "string.base": "Job description must be a string.",
    "string.empty": "Job description is required.",
    "string.min": "Job description must have at least 10 characters.",
    "any.required": "Job description is required.",
  }),
  technicalSkills: Joi.array().items(Joi.string()).required().messages({
    "array.base": "Technical skills must be an array.",
    "array.empty": "Technical skills are required.",
    "any.required": "Technical skills are required.",
  }),
  softSkills: Joi.array().items(Joi.string()).required().messages({
    "array.base": "Soft skills must be an array.",
    "array.empty": "Soft skills are required.",
    "any.required": "Soft skills are required.",
  }),
}).required();

// update job schema
export const updateJobSchema = Joi.object({
  companyId: Joi.string().custom(isValidObjectId).required(),
  jobId: Joi.string().custom(isValidObjectId).required(),
  jobTitle: Joi.string().min(3).max(50).messages({
    "string.base": "Job title must be a string.",
    "string.empty": "Job title is required.",
    "string.min": "Job title must have at least 3 characters.",
    "string.max": "Job title must have at most 50 characters.",
  }),
  jobLocation: Joi.string()
    .valid("onsite", "remotely", "hybrid")
    .insensitive()
    .messages({
      "any.only":
        'Invalid job location. Allowed values are "onsite", "remotely", "hybrid".',
    }),
  workingTime: Joi.string()
    .valid("part-time", "full-time")
    .insensitive()
    .messages({
      "any.only":
        'Invalid working time. Allowed values are "part-time", "full-time".',
    }),
  seniorityLevel: Joi.string()
    .valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO")
    .insensitive()
    .messages({
      "any.only":
        'Invalid seniority level. Allowed values are "Junior", "Mid-Level", "Senior", "Team-Lead", "CTO".',
    }),
  jobDescription: Joi.string().min(10).messages({
    "string.base": "Job description must be a string.",
    "string.empty": "Job description is required.",
    "string.min": "Job description must have at least 10 characters.",
  }),
  technicalSkills: Joi.array().items(Joi.string()).messages({
    "array.base": "Technical skills must be an array.",
    "array.empty": "Technical skills are required.",
  }),
  softSkills: Joi.array().items(Joi.string()).messages({
    "array.base": "Soft skills must be an array.",
    "array.empty": "Soft skills are required.",
  }),
}).required();

// delete job schema
export const deleteJobSchema = Joi.object({
  companyId: Joi.string().custom(isValidObjectId).required(),
  jobId: Joi.string().custom(isValidObjectId).required(),
}).required();

// get jobs for specific company schema
export const getJobsForCompanySchema = Joi.object({
  companyName: Joi.string().min(1).max(50).required().messages({
    "string.base": "Company name must be a string.",
    "string.empty": "Company name is required.",
    "string.min": "Company name must have at least 1 character.",
    "string.max": "Company name must have at most 50 characters.",
    "any.required": "Company name is required.",
  }),
}).required();

// get filtered jobs schema
export const getFilteredJobsSchema = Joi.object({
  jobTitle: Joi.string().min(3).max(50).messages({
    "string.base": "Job title must be a string.",
    "string.empty": "Job title is required.",
    "string.min": "Job title must have at least 3 characters.",
    "string.max": "Job title must have at most 50 characters.",
  }),
  jobLocation: Joi.string()
    .valid("onsite", "remotely", "hybrid")
    .insensitive()
    .messages({
      "any.only":
        'Invalid job location. Allowed values are "onsite", "remotely", "hybrid".',
    }),
  workingTime: Joi.string()
    .valid("part-time", "full-time")
    .insensitive()
    .messages({
      "any.only":
        'Invalid working time. Allowed values are "part-time", "full-time".',
    }),
  seniorityLevel: Joi.string()
    .valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO")
    .insensitive()
    .messages({
      "any.only":
        'Invalid seniority level. Allowed values are "Junior", "Mid-Level", "Senior", "Team-Lead", "CTO".',
    }),
  technicalSkills: Joi.array().items(Joi.string()).messages({
    "array.base": "Technical skills must be an array.",
    "array.empty": "Technical skills are required.",
  }),
}).required();

// apply job schema
export const applyJobSchema = Joi.object({
  jobId: Joi.string().custom(isValidObjectId).required(),
  userTechSkills: Joi.array().items(Joi.string()).required().messages({
    "array.base": "Technical skills must be an array.",
    "array.empty": "Technical skills are required.",
    "any.required": "Technical skills are required.",
  }),
  userSoftSkills: Joi.array().items(Joi.string()).required().messages({
    "array.base": "Soft skills must be an array.",
    "array.empty": "Soft skills are required.",
    "any.required": "Soft skills are required.",
  }),
}).required();
