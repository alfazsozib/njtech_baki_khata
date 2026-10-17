import jwt from "jsonwebtoken";
import User from "../models/Users.js";


export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization && req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            // verify token 
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // attach user to req 
            req.user = await User.findById(decoded.id).select("-password");

            if (!req.user) {
                return res.status(401).json({ message: "User not found with this token" });
            }
            next();

        } catch (error) {
            console.error(("Auth middleware error: ", error));
            return res.status(401).json({ message: "Not authorized, token failed or expired" });
        }
    }
    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token provided" });
    }


}



// Role authorization only allow owners 
export const requireOwner = (req, res, next) => {
    if (req.user && req.user.role === "owner") {
        next();
    } else {
        res.status(403).json({message: "Access forbidden Owner required"})
    }
}