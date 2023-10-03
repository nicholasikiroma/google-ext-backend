import mongoose from "mongoose";
import { DB_URL, PROD_DB_URL, isDevelopment } from "./config/baseConfig.js";
import { logger } from "./config/logger.js";
let connectDB = "";

if (isDevelopment) {
  connectDB = async () => {
    try {
      const db = await mongoose.connect(DB_URL);
      logger.info(
        `Database connected: ${db.connection.host} ${db.connection.name}`
      );
    } catch (err) {
      logger.error(err);
      process.exit(1);
    }
  };
} else {
  connectDB = async () => {
    try {
      const db = await mongoose.connect(PROD_DB_URL);
      logger.info(
        "Database connected: ",
        db.connection.host,
        db.connection.name
      );
    } catch (err) {
      logger.error(err);
    }
  };
}

export default connectDB;
