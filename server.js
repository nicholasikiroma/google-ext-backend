import app from "./src/index.js";
import { PORT, isDevelopment } from "./src/config/baseConfig.js";
import connectDB from "./src/dbConfig.js";

if (isDevelopment) {
  app.listen(PORT, () => {
    console.log(`Dev server running on port ${PORT}`);
  });
} else {
  // connectDB();
  app.listen(PORT, () => {
    console.log(`Prod server running on port ${PORT}`);
  });
}
