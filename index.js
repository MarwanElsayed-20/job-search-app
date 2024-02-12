import express from "express";
import dotenv from "dotenv";
import connectDB from "./DB/Connection.js";
import authRouter from "./src/modules/auth/auth.routers.js";
import userRouter from "./src/modules/user/user.routers.js";
import companyRouter from "./src/modules/company/company.routers.js";
import jobRouter from "./src/modules/job/job.routers.js";

// .env file config
dotenv.config();

// server init
const app = express();
const port = process.env.PORT;

// parsing data
app.use(express.json());

// DB connection
await connectDB();

// APIs
// auth router
app.use("/auth", authRouter);
// user router
app.use("/user", userRouter);
// company router
app.use("/company", companyRouter);
// job router
app.use("/job", jobRouter);

// global error handler
app.use((error, req, res, next) => {
  const statusCode = error.cause || 500;
  return res
    .status(statusCode)
    .json({ success: false, msg: error.message, stack: error.stack });
});

// notfound page
app.all("*", (req, res, next) => {
  return res.json({
    success: false,
    msg: "Page not found.",
  });
});

// run server
app.listen(port, () => {
  console.log("Server is running at port: ", port);
});
