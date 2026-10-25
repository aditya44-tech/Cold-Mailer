import express from "express";
import connectdb from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import fileRoutes from "./routes/file.routes.js";
import mailRoutes from "./routes/mail.routes.js";

const app = express();
const PORT = 5000;
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/file", fileRoutes);
app.use("/api/mail", mailRoutes);

connectdb();
app.get("/", (req, res) => {
  res.send("ColdMailer API is running");
});

// Export for Vercel serverless — do NOT call listen() in serverless environments
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;