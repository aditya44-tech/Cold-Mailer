import express from "express";
import upload from "../middleware/multer.middleware.js";
import { uploadFile } from "../controller/file.controller.js";
const router = express.Router();
router.post("/upload", upload.single("file"), uploadFile);
export default router;