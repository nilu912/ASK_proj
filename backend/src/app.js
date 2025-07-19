import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import userRoute from "./routes/userRoutes.js";
import authRoute from "./routes/authRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/test", (req, res) => res.send("Server is running."));
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);

app.use(errorHandler);

export default app;
