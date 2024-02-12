import mongoose from "mongoose";

const connectDB = async () => {
  return await mongoose
    .connect(process.env.CONNECTION_URL)
    .then(() => console.log("DB connected."))
    .catch((err) => console.log("DB failed to connect.", err));
};

export default connectDB;
