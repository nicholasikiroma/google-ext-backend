import { config } from "dotenv";
config();

export const DB_URL = process.env.DB_URL;
export const isDevelopment = process.env.NODE_ENV === "development";
export const BASE_URL = process.env.BASE_URL;
export const PORT = process.env.PORT || 3000;
