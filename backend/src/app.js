import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import userRoute from "./routes/userRoutes.js";
import authRoute from "./routes/authRoutes.js";
import directorRoute from "./routes/directorRoutes.js";
import eventRoute from "./routes/eventRoutes.js";
import galleryRoute from "./routes/galleryRoutes.js";
import donationRoute from "./routes/donationRoutes.js";
import inquiryRoute from "./routes/inquiryRoutes.js";
import handlerRoute from "./routes/handlerRoutes.js";
import registrationRoute from "./routes/registrationRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";
import deleteImg from "./routes/deleteImage.js";

const app = express();

app.use(express.json());
// app.use(cors());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }));
  
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/test", (req, res) => res.send("Server is running."));
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/directors", directorRoute);
app.use("/api/reg/", registrationRoute);
app.use("/api/events", eventRoute);
app.use("/api/gallery", galleryRoute);
app.use("/api/donations", donationRoute);
app.use("/api/inquiries", inquiryRoute);
app.use("/api/handlers", handlerRoute);
app.use("/api/cloudinary/", deleteImg);

app.use(errorHandler);

export default app;
