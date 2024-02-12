import fs from "fs";
import excelJS from "exceljs";
import User from "../../../DB/models/user.model.js";
import Company from "../../../DB/models/company.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloudinary.js";
import Job from "../../../DB/models/job.model.js";

// add company controller
export const addCompany = asyncHandler(async (req, res) => {
  const {
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
  } = req.body;
  // get user id from user
  const { _id } = req.user;

  // create company
  await Company.create({
    companyName,
    companySlug: companyName.split(" ").join("").toLowerCase(),
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
    companyHR: _id,
  });

  // send response
  return res.json({ success: true, msg: "Company added successfully." });
});

// add company photo controller
export const addCompanyPhoto = asyncHandler(async (req, res) => {
  const company = req.company;

  // check if it is the default company photo
  if (company.companyPhoto.id === "JobSearchApp/DefaultImages/default_rgkasn") {
    // upload photo in specific folder
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `JobSearchApp/companies/${company._id}/companyPhoto/`,
      }
    );

    company.companyPhoto.url = secure_url;
    company.companyPhoto.id = public_id;
  } else {
    // if not update the current photo
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      {
        public_id: company.companyPhoto.id,
      }
    );

    company.companyPhoto.url = secure_url;
    company.companyPhoto.id = public_id;
  }

  await company.save();

  return res.json({ success: true, msg: "Company photo added." });
});

// update company router
export const updateCompany = asyncHandler(async (req, res) => {
  const {
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
  } = req.body;

  const company = req.company;

  // check if name provided
  if (companyName) {
    company.companyName = companyName;
    company.companySlug = companyName.split(" ").join("").toLowerCase();
  } else {
    company.companyName = company.companyName;
  }

  // check if description provided
  description
    ? (company.description = description)
    : (company.description = company.description);

  // check if industry provided
  industry
    ? (company.industry = industry)
    : (company.industry = company.industry);

  // check if address provided
  address ? (company.address = address) : (company.address = company.address);

  // check if number of employees provided
  numberOfEmployees
    ? (company.numberOfEmployees = numberOfEmployees)
    : (company.numberOfEmployees = company.numberOfEmployees);

  // check if email exist
  companyEmail
    ? (company.companyEmail = companyEmail)
    : (company.companyEmail = company.companyEmail);

  // save document changes
  await company.save();

  // send response
  return res.json({ success: true, msg: "Company updated successfully." });
});

// delete company controller
export const deleteCompany = asyncHandler(async (req, res) => {
  const company = req.company;

  if (company.companyPhoto.id !== "JobSearchApp/DefaultImages/default_rgkasn") {
    // delete image
    await cloudinary.uploader.destroy(company.companyPhoto.id);
    // delete folder
    await cloudinary.api.delete_folder(
      `JobSearchApp/companies/${company._id}/`
    );
  }

  const jobs = await Job.find({ company: company._id });
  const jobsId = jobs.map((job) => job._id);

  // delete companies jobs applications
  await Application.deleteMany({ jobId: { $in: jobsId } });

  // delete companies jobs
  await Job.deleteMany({ company: company._id });

  // delete company
  await Company.findByIdAndDelete({ _id: company._id });

  // send response
  return res.json({ success: true, msg: "Company deleted successfully." });
});

// get company controller
export const getCompany = asyncHandler(async (req, res) => {
  // get company data with all jobs
  const company = await Company.findById({ _id: req.company._id })
    .populate({
      path: "companyHR",
      select: "userName email mobileNumber role profilePicture",
      model: User,
    })
    .populate({
      path: "job",
      model: Job,
    });

  return res.json({ success: true, result: { company } });
});

// search for company by name controller
export const searchCompanyByName = asyncHandler(async (req, res) => {
  const company = req.company;

  await company.populate({
    path: "companyHR",
    select: "userName email mobileNumber role profilePicture",
    model: User,
  });

  // send response
  return res.json({ success: true, result: { company } });
});

// get all application for job controller
export const getAllCompanyJobApplications = asyncHandler(async (req, res) => {
  // get job applications
  const jobApplications = req.applications;

  // send response
  return res.json({ success: true, result: { jobApplications } });
});

// get company applications with specific day
export const getCompanyApplicationsWithDay = asyncHandler(async (req, res) => {
  const jobApplications = req.applications;

  // create excel file with applications
  const workbook = new excelJS.Workbook();
  const worksheet = workbook.addWorksheet("jobApplications");

  // check if folder not exist and create it
  const dir = "./jobApplicationsSheets";

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  const excelFile = `jobApplicationsSheets/jobApplications-${req.query.day}.xlsx`;

  // create sheet columns
  worksheet.columns = [
    { header: "jobId", key: "jobId", width: 50 },
    { header: "userId", key: "userId", width: 50 },
    { header: "userTechSkills", key: "userTechSkills", width: 50 },
    { header: "userSoftSkills", key: "userSoftSkills", width: 50 },
  ];

  // create rows
  jobApplications.forEach((application, index) => {
    worksheet.addRow({
      jobId: application.jobId,
      userId: application.userId._id,
      userTechSkills: application.userTechSkills,
      userSoftSkills: application.userSoftSkills,
    });
  });

  // save file
  await workbook.xlsx.writeFile(excelFile);

  // set content disposition to make file downloadable
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${encodeURIComponent("jobApplications.xlsx")}`
  );

  // send response
  return res.json({
    success: true,
    msg: "Excel file created, try to download it now.",
    result: { jobApplications },
  });
});
