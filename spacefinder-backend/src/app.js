import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import timetableRoutes from "./routes/timetableRoutes.js";
import availabilityRoutes from "./routes/availabilityRoutes.js";
import cancellationRoutes from "./routes/cancellationRoutes.js";

const app = express();


// Middleware
app.use(cors());
app.use(express.json());


// Health check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "NMIMS SpaceFinder backend is running"
    });
});


// API routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/cancellations", cancellationRoutes);


export default app;