import dotenv from "dotenv";
dotenv.config();
export const { PORT, DEBUG_MODE, DB_URI, JWT_SECRET, REFRESH_SECRET, APP_URL } = process.env;
