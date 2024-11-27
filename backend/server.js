import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";
import userRoutes from "./routes/users.js";
import taskRoutes from "./routes/tasks.js";
import auth from "./middleware/auth.js";

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "../frontend")));

// API routes
app.use("/api/auth", userRoutes);
app.use("/api/tasks", auth, taskRoutes);

// Authenticated static file routes
app.get("/dashboard.html", auth, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "dashboard.html"));
});

app.get("/edit-task.html", auth, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "edit-task.html"));
});

// Catch-all route for frontend
app.get("*", (req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ message: "API route not found" });
  }
  res.sendFile(path.join(__dirname, "../frontend", "loginPage.html"));
});

// Error handling middleware
app.use(errorHandler);

// Export the app for Vercel
export default app;
