import express from "express";
import cors from "cors";
import indexRoutes from "./routes/index";
import authRoutes from "./routes/auth";
import webhookRoutes from "./routes/webhooks";
import eventRoutes from "./routes/events";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/", indexRoutes);
app.use("/", authRoutes);
app.use("/webhooks", webhookRoutes);
app.use("/events", eventRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});