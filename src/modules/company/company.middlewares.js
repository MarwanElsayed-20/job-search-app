import Application from "../../../DB/models/application.model.js";
import Company from "../../../DB/models/company.model.js";
import Job from "../../../DB/models/job.model.js";
import User from "../../../DB/models/user.model.js";
import asyncHandler from "../../utils/asyncHandler.js";

// check if company name not exist before
export const isCompanyNameUnique = asyncHandler(async (req, res, next) => {
  const { companyName } = req.body;

  // make slug from company name
  const companySlug = companyName.split(" ").join("").toLowerCase();

  // check if the slug already exist
  const company = await Company.findOne({
    companySlug,
  });
  if (company) {
    return next(new Error("Company name already exist.", { cause: 409 }));
  }

  return next();
});

// check if company mail not exist before
export const isCompanyEmailNotExist = asyncHandler(async (req, res, next) => {
  const { companyEmail } = req.body;

  const company = await Company.findOne({ companyEmail });

  if (company) {
    return next(new Error("Company email already exist.", { cause: 409 }));
  }

  return next();
});

// check if file provided
export const isFileProvided = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new Error("File not provided", { cause: 400 }));
  }
  return next();
});

// check if company not found
export const isCompanyExist = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;

  // check if company id provided
  if (!companyId) {
    return next(new Error("Company id not provided.", { cause: 400 }));
  }

  // check if company exist
  const company = await Company.findById({ _id: companyId });

  if (!company) {
    return next(new Error("Company not found.", { cause: 404 }));
  }

  req.company = company;
  return next();
});

// check if the user is the company owner
export const isUserIsCompanyOwner = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const company = req.company;

  // compare user id with companyHR id
  if (_id.toString() !== company.companyHR.toString()) {
    return next(new Error("You are not the company owner", { cause: 401 }));
  }

  return next();
});

// check if company name exist
export const isCompanyNameExist = asyncHandler(async (req, res, next) => {
  const { companyName } = req.query;

  if (!companyName) {
    return next(
      new Error("Company name required as query param.", { cause: 404 })
    );
  }

  // get company name as slug
  const companySlug = companyName.split(" ").join("").toLowerCase();

  // search if company exist with slug
  const company = await Company.findOne({ companySlug });

  if (!company) {
    return next(new Error("Company not found", { cause: 404 }));
  }

  req.company = company;
  return next();
});

// check if job exist
export const isJobExist = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;

  // check if job id provided
  if (!jobId) {
    return next(new Error("Job id not provided.", { cause: 400 }));
  }

  // check if job exist
  const job = await Job.findById({ _id: jobId });

  if (!job) {
    return next(new Error("Job not found.", { cause: 404 }));
  }

  req.job = job;
  return next();
});

// check if user is job owner
export const isUserIsJobOwner = asyncHandler(async (req, res, next) => {
  const job = req.job;
  const user = req.user;

  if (job.addedBy.toString() !== user._id.toString()) {
    return next(new Error("Company not the Job owner", { cause: 401 }));
  }

  return next();
});

// check if their job applications for a company job
export const isCompanyJobHasApplication = asyncHandler(
  async (req, res, next) => {
    const job = req.job;

    const jobApplications = await Application.find({ jobId: job._id }).populate(
      {
        path: "userId",
        select: "firstName lastName email dateOfBirth profilePicture",
        model: User,
      }
    );

    if (jobApplications.length == 0) {
      return next(new Error("No applications for this job.", { cause: 404 }));
    }

    req.applications = jobApplications;
    return next();
  }
);

// check if company has jobs
export const isCompanyHasJobs = asyncHandler(async (req, res, next) => {
  const company = req.company;
  const jobs = await Job.find({ company: company._id });

  if (jobs.length == 0) {
    return next(new Error("No jobs found for this company.", { cause: 404 }));
  }

  req.jobs = jobs;
  return next();
});

// check if company has job application with specific day
export const isCompanyHasJobApplicationsWithDay = asyncHandler(
  async (req, res, next) => {
    const { day } = req.query;

    const jobApplications = await Application.find({
      createdDay: day,
    }).populate({
      path: "userId",
      select: "firstName lastName email dateOfBirth profilePicture",
      model: User,
    });

    if (jobApplications.length == 0) {
      return next(
        new Error("No applications found for this day.", { cause: 404 })
      );
    }

    req.applications = jobApplications;
    return next();
  }
);
