import { Types } from "mongoose";

export const schemasValidation = (schema) => {
  return (req, res, next) => {
    const data = { ...req.body, ...req.params, ...req.query };

    const validationsResult = schema.validate(data, { abortEarly: false });

    if (validationsResult.error) {
      const errors = validationsResult.error.details.map((err) => err.message);

      return next(new Error(errors));
    }

    return next();
  };
};

export const isValidObjectId = (value, helper) => {
  if (Types.ObjectId.isValid(value)) {
    return true;
  }
  return helper.message("Invalid objectID.");
};
