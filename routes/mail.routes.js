import express from "express";
import { sendMail, generateEmails, getMyEmails, getEmailById, updateEmail, deleteEmail } from "../controller/mail.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/generate", authMiddleware, generateEmails);
router.post("/send", authMiddleware, sendMail);
router.get("/", authMiddleware, getMyEmails);
router.get("/:id", authMiddleware, getEmailById);
router.put("/:id", authMiddleware, updateEmail);
router.delete("/:id", authMiddleware, deleteEmail);
export default router;