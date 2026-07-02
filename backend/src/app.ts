import express from "express";
import authRoutes from "./modules/auth/auth.route.js";
import { errorHandler } from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json()); // Parses incoming requests with JSON payloads
app.use(cookieParser());

app.get('/', (req, res)=>{
    res.send("API is Running.....");
})

app.use('/api/auth', authRoutes);

app.use(errorHandler);

export default app;