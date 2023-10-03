import app from "./src/index.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import { PORT, isDevelopment } from "./src/config/baseConfig.js";
import connectDB from "./src/dbConfig.js";
import { logger } from "./src/config/logger.js";

process.on("uncaughtException", (error) => {
  errorHandler.handleError(error);
  if (!errorHandler.isTrustedError(error)) {
    process.exit(1);
  }
});

connectDB();

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
