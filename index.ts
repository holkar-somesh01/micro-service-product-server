import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import productRoutes from './routes/productRoutes';
import mongoose from "mongoose";
import cloudinary from "cloudinary";
import { initializeRabbitMQ } from "./connection/rabbit";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: true,
    credentials: true
}));


cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

mongoose
    .connect(process.env.MONGO_URI as string)
    .then(() => console.log("MONGO_CONNECTED"))
    .catch((err) => console.error("MongoDB connection error:", err));
initializeRabbitMQ();

// Routes

app.use("/api/products", productRoutes);


app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.url}`);
    res.status(404).json({ message: "Resource Not Found" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
