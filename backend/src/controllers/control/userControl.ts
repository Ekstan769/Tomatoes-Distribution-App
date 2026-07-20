import { Request, Response } from "express";
import * as entity from "../entity";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from '../../db/datasource';

export const signUp = async (req: Request, res: Response) => {
  const { userName, phoneNumber, password, securityQuestion, securityAnswer } = req.body || {};
  
  try {
    // Explicitly ensure all required fields are present to prevent downstream crashes
    if (!userName || !phoneNumber || !password || !securityQuestion || !securityAnswer) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields, including username, password, security question, and answer, are required" 
      });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const userRepo = AppDataSource.getRepository(entity.User);
    const existingUser = await userRepo.findOne({ where: { phoneNumber } });

    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const hashedAnswer = await bcrypt.hash(securityAnswer.toLowerCase().trim(), salt);

    const created = userRepo.create({
      userName,
      phoneNumber,
      password: hashedPassword,
      securityQuestion,
      role: req.body.role,
      securityAnswer: hashedAnswer,
    });
    
    const savedUser = await userRepo.save(created);
    
    // Aligned to the corrected 'id' field from our User entity update
    const userPayload = { 
      id: savedUser.id, 
      userName: savedUser.userName, 
      phoneNumber: savedUser.phoneNumber 
    };

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ success: false, message: 'Server misconfiguration: auth secret missing' });
    }

    const token = jwt.sign(userPayload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d" as any,
    });
    
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      user: userPayload,
    });

  } catch (error: any) {
    console.error("DEBUG SIGNUP ERROR:", error);
    if (error?.code === '23505') {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }
    // Fixed: Catches all other internal variations so the connection never hangs
    return res.status(500).json({ success: false, message: "Unexpected server error during sign up" });
  }
};

export const signIn = async (req: Request, res: Response) => {
  const { phoneNumber, password } = req.body || {};
  
  try {
    if (!phoneNumber || !password) {
      return res.status(400).json({ success: false, message: "Number and password required" });
    }
    
    const userRepo = AppDataSource.getRepository(entity.User);
    
    // Fixed: Using addSelect() ensures primary metadata like fields and emails are preserved alongside the hidden password field
    const user = await userRepo.createQueryBuilder("user")
      .where("user.phoneNumber = :phoneNumber", { phoneNumber })
      .addSelect("user.password")
      .getOne();

    if (!user || !user.password) {
      return res.status(401).json({ success: false, message: "Invalid number or password" });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid number or password" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ success: false, message: 'Server misconfiguration: auth secret missing' });
    }

    const info = {
      id: user.id,      
      email: user.email || "",
      phoneNumber: user.phoneNumber
    };

    const token = jwt.sign(info, process.env.JWT_SECRET, { 
      expiresIn: process.env.JWT_EXPIRES_IN || "1d" as any
    });

    return res.status(200).json({
      success: true,
      message: "Sign-in completed",
      token,
      user: {
        id: user.id,
        role: user.role,
        phoneNumber: user.phoneNumber
      }, 
    });
  } catch (error) {
    console.error("DEBUG SIGNIN ERROR:", error);
    return res.status(500).json({ success: false, message: "Unexpected server error" });
  }
};

export const getRecoveryQuestion = async (req: Request, res: Response) => {
  const { email } = req.body || {};

  try {
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const userRepo = AppDataSource.getRepository(entity.User);
    const user = await userRepo.findOne({ where: { email: email.toLowerCase().trim() } });

    if (!user || !user.securityQuestion) {
      return res.status(404).json({ success: false, message: "No security question configured for this user" });
    }

    return res.status(200).json({
      success: true,
      securityQuestion: user.securityQuestion,
    });
  } catch (error) {
    console.error("DEBUG RECOVERY ERROR:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, securityAnswer, newPassword } = req.body || {};

  try {
    if (!email || !securityAnswer || !newPassword) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const userRepo = AppDataSource.getRepository(entity.User);
    
    // Fixed: Using query builder here to securely bring hidden validation columns into range
    const user = await userRepo.createQueryBuilder("user")
      .where("user.email = :email", { email: email.toLowerCase().trim() })
      .addSelect(["user.password", "user.securityAnswer"])
      .getOne();

    const genericError = "Invalid credentials or recovery parameters";

    if (!user || !user.securityAnswer) {
      return res.status(401).json({ success: false, message: genericError });
    }

    const isAnswerCorrect = await bcrypt.compare(
      securityAnswer.toLowerCase().trim(),
      user.securityAnswer
    );

    if (!isAnswerCorrect) {
      return res.status(401).json({ success: false, message: genericError });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password || "");
    if (isSamePassword) {
      return res.status(400).json({ success: false, message: "New password cannot be the same as the old one" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await userRepo.save(user);

    return res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("DEBUG RESET ERROR:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};