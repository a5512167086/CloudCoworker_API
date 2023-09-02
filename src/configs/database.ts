import mongoose from "mongoose";

const connectMongoDb = () => {
  const MONGO_URL = process.env.MONGO_URL as string;
  try {
    mongoose.connect(MONGO_URL);
    console.log("Database connected");
  } catch (err) {
    console.log(err);
  }
};

export default connectMongoDb;
