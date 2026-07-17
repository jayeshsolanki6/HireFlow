import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./modules/auth/auth.route.js";
import companyRoutes from "./modules/company/company.route.js";
import jobRoutes from "./modules/job/job.route.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res)=>{
    res.send("API is Running.....");
})

app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/jobs', jobRoutes);

app.use(errorHandler);

app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});