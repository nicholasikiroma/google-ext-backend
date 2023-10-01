import app from "./src/index.js";
import { PORT, isDevelopment } from "./src/config/baseConfig.js";
import connectDB from "./src/dbConfig.js";

connectDB();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
