import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async (DATABASE_URI) => {
  try {
    const conn = await mongoose.connect(DATABASE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`mongoDB connected to : ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
