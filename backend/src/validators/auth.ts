import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../db/datasource";
import * as entity from "../controllers/entity";
import bcrypt from "bcrypt";

// Extending Express Request type to include 'user' using 'id'
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string; 
        phoneNumber: string; // Holds the phone string, or an empty string fallback for OAuth onboarding
        role: string;
      };
    }
  }
}
 
export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
 
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
 
  const token = authHeader.split(" ")[1];
 
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "Auth secret missing on server" });
    }

    // Decode using 'id' instead of 'userId'
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };

    const userRepo = AppDataSource.getRepository(entity.User);
    
    // Querying with the consolidated primary key 'id'
    const found = await userRepo.findOne({ where: { id: decoded.id } as any });
    if (!found) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    // Sanitize and attach user info. Fallback to empty string if phoneNumber is null (OAuth onboarding)
    req.user = { 
      id: found.id, 
      phoneNumber: found.phoneNumber || "", 
      role: found.role 
    };
    next();

  } catch (e: any) {
    if (e.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired, please login again" });
    }
    if (e.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    return res.status(401).json({ message: "Unauthorized" });
  }
};
 
export const authorizeRoles = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Safety check for user existence and permissions
    if (!req.user || !roles.includes(req.user.role)) {
      try {
        // Optional Activity Logging can be safely handled here
      } catch (logError) {
        console.error("Failed to write access log:", logError);
      }

      return res.status(403).json({ message: "Forbidden: insufficient permission" });
    }
    next();
  };
};

export const verifySecurityAnswer = async (req: Request, res: Response) => {
  const { phoneNumber, securityAnswer } = req.body;

  try {
    if (!phoneNumber || !securityAnswer) {
      return res.status(400).json({ message: "Phone number and security answer are required" });
    }

    const userRepo = AppDataSource.getRepository(entity.User);
    
    // Using TypeORM createQueryBuilder to cleanly select the hidden securityAnswer column
    const user = await userRepo.createQueryBuilder("user")
      .where("user.phoneNumber = :phoneNumber", { phoneNumber })
      .addSelect("user.securityAnswer")
      .getOne();

    if (!user || !user.securityAnswer) {
      return res.status(401).json({ message: "Invalid request" });
    }

    const isAnswerCorrect = await bcrypt.compare(
      securityAnswer.toLowerCase().trim(),
      user.securityAnswer
    );

    if (!isAnswerCorrect) {
      return res.status(401).json({ message: "Incorrect security answer" });
    }

    return res.status(200).json({ 
      success: true, 
      message: "Answer verified",
    });
  } catch (error) {
    console.error("Security answer verification failed:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};