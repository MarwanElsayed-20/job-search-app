import Application from "../../../DB/models/application.model.js";
import Company from "../../../DB/models/company.model.js";
import Job from "../../../DB/models/job.model.js";
import asyncHandler from "../../utils/asyncHandler.js";

// check if company exist
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

// is job is not a exist before
export const isJobNotExist = asyncHandler(async (req, res, next) => {
  const { jobTitle, jobLocation, workingTime, seniorityLevel } = req.body;
  const company = req.company;

  // to make sure job not a duplicate in the same company
  const job = await Job.find({
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    company: company._id,
  });

  console.log(job);

  if (job.length > 0) {
    return next(new Error("Job already exist.", { cause: 409 }));
  }

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

// check if company is the job owner
export const isCompanyIsJobOwner = asyncHandler(async (req, res, next) => {
  const job = req.job;
  const company = req.company;

  if (job.company.toString() !== company._id.toString()) {
    return next(new Error("Company not the Job owner", { cause: 401 }));
  }

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

// check if there available jobs
export const isJobs = asyncHandler(async (req, res, next) => {
  const jobs = await Job.find();

  if (!jobs) {
    return next(new Error("No jobs found.", { cause: 404 }));
  }

  req.jobs = jobs;
  return next();
});

// check if company name exist
export const isCompanyNameExist = asyncHandler(async (req, res, next) => {
  const { companyName } = req.query;

  if (!companyName) {
    return next(
      new Error("Company name required as query param.", { cause: 400 })
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

// check if filtered jobs available
export const isJobWithFilter = asyncHandler(async (req, res, next) => {
  const {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    technicalSkills,
  } = req.query;

  // make query object
  let query = {};

  // check for each query provided and add to query object
  if (jobTitle) query.jobTitle = jobTitle;
  if (jobLocation) query.jobLocation = jobLocation;
  if (workingTime) query.workingTime = workingTime;
  if (seniorityLevel) query.seniorityLevel = seniorityLevel;
  if (technicalSkills) query.technicalSkills = { $in: technicalSkills };

  console.log(query);
  // find document that match the all conditions
  const jobs = await Job.find(query);

  if (jobs.length == 0) {
    return next(new Error("No jobs found match the filters.", { cause: 404 }));
  }

  req.jobs = jobs;
  return next();
});

// check if file attached
export const isFileAttached = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new Error("File not attached.", { cause: 400 }));
  }
  return next();
});

// check if application not exist before
export const isFirstUserApplication = asyncHandler(async (req, res, next) => {
  const user = req.user;

  const application = await Application.findOne({ userId: user._id });

  if (application) {
    return next(new Error("You already applied for this job.", { cause: 409 }));
  }

  return next();
});
