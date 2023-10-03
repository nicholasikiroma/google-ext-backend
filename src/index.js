import express from "express";
import cors from "cors";
import router from "./routes/video.route.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Third-party middlewares
app.use(cors());

// In-built middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

// custom middlewares
app.use("/api", router);
app.use(async (err, req, res, next) => {
  if (!errorHandler.isTrustedError(err)) {
    next(err);
  }
  await errorHandler.handleError(err);
});

export default app;
