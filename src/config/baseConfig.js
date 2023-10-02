import { config } from "dotenv";
config();

export const DB_URL = process.env.DB_URL;
export const isDevelopment = process.env.NODE_ENV === "development";
export const BASE_URL = process.env.BASE_URL;
export const PORT = process.env.PORT || 3000;
export const API_KEY = process.env.API_KEY;
export const RABBITMQ_URL = process.env.RABBITMQ_URL;