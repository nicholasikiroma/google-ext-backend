import app from "./src/index.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import { PORT, isDevelopment } from "./src/config/baseConfig.js";
import connectDB from "./src/dbConfig.js";
import { logger } from "./src/config/logger.js";
import redoc from "redoc-express";

process.on("uncaughtException", (error) => {
  errorHandler.handleError(error);
  if (!errorHandler.isTrustedError(error)) {
    process.exit(1);
  }
});

connectDB();

// serve your swagger.json file
app.get("/docs/swagger.json", (req, res) => {
  res.sendFile("specs.json", { root: "." });
});

// define title and specUrl location
// serve redoc
app.get(
  "/docs",
  redoc({
    title: "API Docs",
    specUrl: "/docs/swagger.json",
    nonce: "", // <= it is optional,we can omit this key and value
    // we are now start supporting the redocOptions object
    // you can omit the options object if you don't need it
    // https://redocly.com/docs/api-reference-docs/configuration/functionality/
    redocOptions: {
      theme: {
        colors: {
          primary: {
            main: "#6EC5AB",
          },
        },
        typography: {
          fontFamily: `"museo-sans", 'Helvetica Neue', Helvetica, Arial, sans-serif`,
          fontSize: "15px",
          lineHeight: "1.5",
          code: {
            code: "#87E8C7",
            backgroundColor: "#4D4D4E",
          },
        },
        menu: {
          backgroundColor: "#ffffff",
        },
      },
    },
  })
);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
