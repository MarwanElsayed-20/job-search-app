import Application from "../../../DB/models/application.model.js";
import Job from "../../../DB/models/job.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloudinary.js";

// add job controller
export const addJob = asyncHandler(async (req, res) => {
  const company = req.company;
  const user = req.user;

  // create job
  await Job.create({ ...req.body, addedBy: user._id, company: company._id });

  // send response
  return res.json({ success: true, msg: "Job added successfully." });
});

// update job controller
export const updateJob = asyncHandler(async (req, res) => {
  const job = req.job;
  const {
    jobTitle = job.jobTitle,
    jobLocation = job.jobLocation,
    workingTime = job.workingTime,
    seniorityLevel = job.seniorityLevel,
    jobDescription = job.jobDescription,
    technicalSkills = job.technicalSkills,
    softSkills = job.softSkills,
  } = req.body;

  // assign new values
  job.jobTitle = jobTitle;
  job.jobLocation = jobLocation;
  job.workingTime = workingTime;
  job.seniorityLevel = seniorityLevel;
  job.jobDescription = jobDescription;
  job.technicalSkills = technicalSkills;
  job.softSkills = softSkills;

  // save updates
  await job.save();

  // sent response
  return res.json({ success: true, msg: "Job updated successfully." });
});

// delete job controller
export const deleteJob = asyncHandler(async (req, res) => {
  const { _id } = req.job;

  // delete job applications
  await Application.deleteMany({ jobId: _id });

  // delete job
  await Job.findByIdAndDelete({ _id });

  // send response
  return res.json({ success: true, msg: "Job deleted successfully." });
});

// get all jobs with companies information controller
export const getAllJobWithCompaniesInfo = asyncHandler(async (req, res) => {
  // get jobs
  const jobs = req.jobs;

  // send response
  return res.json({ success: true, result: { jobs } });
});

// get all jobs for company controller
export const getJobsForCompany = asyncHandler(async (req, res) => {
  // get jobs
  const jobs = req.jobs;

  // send response
  return res.json({ success: true, result: { jobs } });
});

// get filtered jobs controller
export const getFilteredJobs = asyncHandler(async (req, res) => {
  // get jobs
  const jobs = req.jobs;

  // send response
  return res.json({ success: true, result: { jobs } });
});

// apply to job controller
export const applyJob = asyncHandler(async (req, res) => {
  const job = req.job;
  const user = req.user;
  const { userTechSkills, userSoftSkills } = req.body;

  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    {
      format: "pdf",
      folder: `JobSearchApp/jobs/company-${job.company}/job-${job._id}/applications/`,
      resource_type: "raw",
      content_type: "application/pdf",
    }
  );

  let day = new Date();
  day = day.toISOString().split("T")[0];

  await Application.create({
    jobId: job._id,
    userId: user._id,
    userTechSkills,
    userSoftSkills,
    userResume: { url: secure_url, id: public_id },
    createdDay: day,
  });

  return res.json({ success: true, msg: "Applied to job successfully." });
});
