import mongoose from "mongoose";
import { DB_URL, PROD_DB_URL, isDevelopment } from "./config/baseConfig.js";
let connectDB = "";

if (isDevelopment) {
  connectDB = async () => {
    try {
      const db = await mongoose.connect(DB_URL);
      console.log(
        "Database connected: ",
        db.connection.host,
        db.connection.name
      );
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  };
} else {
  connectDB = async () => {
    try {
      const db = await mongoose.connect(PROD_DB_URL);
      console.log(
        "Database connected: ",
        db.connection.host,
        db.connection.name
      );
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  };
}

export default connectDB;
