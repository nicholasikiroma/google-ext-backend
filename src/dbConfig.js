import mongoose from "mongoose";
import { DB_URL, PROD_DB_URL, isDevelopment } from "./config/baseConfig.js";
import { logger } from "./config/logger.js";
let connectDB = "";

connectDB = async () => {
  try {
    const connUrl = isDevelopment ? DB_URL : PROD_DB_URL;
    const db = await mongoose.connect(connUrl);
    logger.info(
      `Database connected: ${db.connection.host} ${db.connection.name}`
    );
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

export default connectDB;
