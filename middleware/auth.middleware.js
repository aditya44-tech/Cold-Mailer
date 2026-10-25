import jwt from "jsonwebtoken";
import User from "../model/auth.model.js";

export const authMiddleware = async (req, res, next) => {
    try{
        if (!req.headers.authorization) {
            return res.status(401).json({ message: "No token provided" });
        }
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if(!user){
            return res.status(401).json({
                message: "User not found"
            });
        }
        req.user = user;
        next();
    }
    catch(error){
        return res.status(500).json({
            message: "Invalid token"
        });
    }
}
