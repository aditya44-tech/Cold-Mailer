import express from "express";
import connectdb from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();
const PORT = 5000;
app.use(express.json());
app.use("/api/auth", authRoutes);

connectdb();
app.get("/", (req, res) => {
  res.send("ColdMailer API is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});