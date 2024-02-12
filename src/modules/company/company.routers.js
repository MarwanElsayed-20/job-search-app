import { Router } from "express";
import { isAuthenticated } from "../../middlewares/isAuthenticated.middleware.js";
import { isAuthorized } from "../../middlewares/isAuthorized.middleware.js";
import { schemasValidation } from "../../middlewares/validation.middlewares.js";
import * as companySchemas from "../../validation/company.schemas.js";
import * as companyMiddlewares from "./company.middlewares.js";
import * as companyControllers from "./company.controllers.js";
import fileUpload, { fileValidation } from "../../utils/fileUpload.js";
import jobRouter from "../job/job.routers.js";

const companyRouter = Router();

// enter job router from company router
companyRouter.use("/:companyId/job", jobRouter);

// add company router
companyRouter.post(
  "/",
  isAuthenticated,
  isAuthorized("companyHR"),
  schemasValidation(companySchemas.addCompany),
  companyMiddlewares.isCompanyNameUnique,
  companyMiddlewares.isCompanyEmailNotExist,
  companyControllers.addCompany
);

// add company photo router
companyRouter.patch(
  "/company-photo/:companyId",
  isAuthenticated,
  isAuthorized("companyHR"),
  fileUpload(fileValidation.images).single("companyPhoto"),
  schemasValidation(companySchemas.addCompanyPhotoSchema),
  companyMiddlewares.isFileProvided,
  companyMiddlewares.isCompanyExist,
  companyMiddlewares.isUserIsCompanyOwner,
  companyControllers.addCompanyPhoto
);

// update company router
companyRouter.put(
  "/:companyId",
  isAuthenticated,
  isAuthorized("companyHR"),
  schemasValidation(companySchemas.updateCompanySchema),
  companyMiddlewares.isCompanyNameUnique,
  companyMiddlewares.isCompanyEmailNotExist,
  companyMiddlewares.isCompanyExist,
  companyMiddlewares.isUserIsCompanyOwner,
  companyControllers.updateCompany
);

// delete company router
companyRouter.delete(
  "/:companyId",
  isAuthenticated,
  isAuthorized("companyHR"),
  schemasValidation(companySchemas.deleteCompanySchema),
  companyMiddlewares.isCompanyExist,
  companyMiddlewares.isUserIsCompanyOwner,
  companyControllers.deleteCompany
);

// get company data
companyRouter.get(
  "/get-company/:companyId",
  isAuthenticated,
  isAuthorized("companyHR"),
  schemasValidation(companySchemas.getCompanySchema),
  companyMiddlewares.isCompanyExist,
  companyMiddlewares.isUserIsCompanyOwner,
  companyControllers.getCompany
);

// search for company with name
companyRouter.get(
  "/search-by-name",
  isAuthenticated,
  isAuthorized("user", "companyHR"),
  schemasValidation(companySchemas.searchCompanyByNameSchema),
  companyMiddlewares.isCompanyNameExist,
  companyControllers.searchCompanyByName
);

// get all applications for specific job in the company
companyRouter.get(
  "/:companyId/job/:jobId/job-applications",
  isAuthenticated,
  isAuthorized("companyHR"),
  schemasValidation(companySchemas.getAllCompanyJobApplicationsSchema),
  companyMiddlewares.isCompanyExist,
  companyMiddlewares.isJobExist,
  companyMiddlewares.isUserIsCompanyOwner,
  companyMiddlewares.isUserIsJobOwner,
  companyMiddlewares.isCompanyJobHasApplication,
  companyControllers.getAllCompanyJobApplications
);

// get applications for specific company filtered by day
companyRouter.get(
  "/:companyId/jobs-applications",
  isAuthenticated,
  isAuthorized("companyHR"),
  schemasValidation(companySchemas.getCompanyJobsApplicationByDaySchema),
  companyMiddlewares.isCompanyExist,
  companyMiddlewares.isUserIsCompanyOwner,
  companyMiddlewares.isCompanyHasJobs,
  companyMiddlewares.isCompanyHasJobApplicationsWithDay,
  companyControllers.getCompanyApplicationsWithDay
);

export default companyRouter;
