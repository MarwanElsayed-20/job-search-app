import { Router } from "express";
import { isAuthenticated } from "../../middlewares/isAuthenticated.middleware.js";
import { isAuthorized } from "../../middlewares/isAuthorized.middleware.js";
import { schemasValidation } from "../../middlewares/validation.middlewares.js";
import * as jobSchemas from "../../validation/job.schemas.js";
import * as jobMiddlewares from "./job.middlewares.js";
import * as jobControllers from "./job.controllers.js";
import fileUpload, { fileValidation } from "../../utils/fileUpload.js";

// make merge params true to get the params from the company router
const jobRouter = Router({ mergeParams: true });

// add job router
jobRouter.post(
  "/",
  isAuthenticated,
  isAuthorized("companyHR"),
  schemasValidation(jobSchemas.addJobSchema),
  jobMiddlewares.isCompanyExist,
  jobMiddlewares.isUserIsCompanyOwner,
  jobMiddlewares.isJobNotExist,
  jobControllers.addJob
);

// update job router
jobRouter.put(
  "/:jobId",
  isAuthenticated,
  isAuthorized("companyHR"),
  schemasValidation(jobSchemas.updateJobSchema),
  jobMiddlewares.isCompanyExist,
  jobMiddlewares.isUserIsCompanyOwner,
  jobMiddlewares.isJobExist,
  jobMiddlewares.isCompanyIsJobOwner,
  jobMiddlewares.isUserIsJobOwner,
  jobMiddlewares.isJobNotExist,
  jobControllers.updateJob
);

// delete job router
jobRouter.delete(
  "/:jobId",
  isAuthenticated,
  isAuthorized("companyHR"),
  schemasValidation(jobSchemas.deleteJobSchema),
  jobMiddlewares.isCompanyExist,
  jobMiddlewares.isUserIsCompanyOwner,
  jobMiddlewares.isJobExist,
  jobMiddlewares.isCompanyIsJobOwner,
  jobMiddlewares.isUserIsJobOwner,
  jobControllers.deleteJob
);

// get all jobs with companies information router
jobRouter.get(
  "/all-jobs",
  isAuthenticated,
  isAuthorized("user", "companyHR"),
  jobMiddlewares.isJobs,
  jobControllers.getAllJobWithCompaniesInfo
);

// get all jobs for specific company router
jobRouter.get(
  "/company-jobs",
  isAuthenticated,
  isAuthorized("user", "companyHR"),
  schemasValidation(jobSchemas.getJobsForCompanySchema),
  jobMiddlewares.isCompanyNameExist,
  jobMiddlewares.isCompanyHasJobs,
  jobControllers.getJobsForCompany
);

// get jobs with filter router
jobRouter.get(
  "/filtered-jobs",
  isAuthenticated,
  isAuthorized("user", "companyHR"),
  schemasValidation(jobSchemas.getFilteredJobsSchema),
  jobMiddlewares.isJobWithFilter,
  jobControllers.getFilteredJobs
);

// apply to job router
jobRouter.post(
  "/:jobId/application",
  isAuthenticated,
  isAuthorized("user"),
  fileUpload(fileValidation.files).single("userResume"),
  schemasValidation(jobSchemas.applyJobSchema),
  jobMiddlewares.isFileAttached,
  jobMiddlewares.isJobExist,
  jobMiddlewares.isFirstUserApplication,
  jobControllers.applyJob
);

export default jobRouter;
