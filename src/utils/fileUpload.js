import multer, { diskStorage } from "multer";

export const fileValidation = {
  images: ["image/png", "image/jpeg"],
  files: ["application/pdf"],
};

const fileUpload = (filter) => {
  const fileFilter = (req, file, cb) => {
    if (!filter.includes(file.mimetype)) {
      return cb(new Error("Invalid format"), false);
    }
    return cb(null, true);
  };

  return multer({ storage: diskStorage({}), fileFilter });
};

export default fileUpload;
