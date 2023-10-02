import express from "express";
import cors from "cors";
import morgan from "morgan";
import router from "./routes/video.route.js";
import errorHandler from "./middleware/errorHandler.js";
import { isDevelopment } from "./config/baseConfig.js";

const app = express();

// Third-party middlewares
app.use(cors());

if (isDevelopment) {
  app.use(morgan("dev"));
}

// In-built middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

// custom middlewares
app.use("/api", router);
app.use(errorHandler);

export default app;
