import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../../db/datasource";
import * as entity from "../entity";
import bcrypt from "bcrypt";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleSignIn = async (req: Request, res: Response) => {
  const { idToken } = req.body || {};

  try {
    if (!idToken) {
      return res.status(400).json({ success: false, message: "Google ID Token is required" });
    }

    // 1. Verify token validity with Google
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ success: false, message: "Invalid Google token payload" });
    }

    const { email, name, picture } = payload;
    const userRepo = AppDataSource.getRepository(entity.User);

    // 2. Check if user already exists
    let user = await userRepo.findOne({ where: { email: email.toLowerCase().trim() } });

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ success: false, message: "Auth secret missing on server configuration" });
    }

    // CASE A: Brand New User -> Create Incomplete Account Profile
    if (!user) {
      const newUser = userRepo.create({
        email: email.toLowerCase().trim(),
        userName: name || "Google User",
        profilePic: picture || "",
        isComplete: false, // Explicitly marked incomplete due to missing phone
      });

      user = await userRepo.save(newUser);

      // Generate a short-lived onboarding token
      const onboardingToken = jwt.sign(
        { id: user.id, isComplete: false }, 
        process.env.JWT_SECRET, 
        { expiresIn: "15m" }
      );

      return res.status(200).json({
        success: true,
        status: "NEED_ONBOARDING",
        message: "Google account authenticated. Please complete profile details.",
        token: onboardingToken,
        user: {
          id: user.id,
          email: user.email,
          userName: user.userName
        }
      });
    }

    // CASE B: Existing User but hasn't completed their setup steps yet
    if (!user.isComplete || !user.phoneNumber) {
      const onboardingToken = jwt.sign(
        { id: user.id, isComplete: false }, 
        process.env.JWT_SECRET, 
        { expiresIn: "15m" }
      );

      return res.status(200).json({
        success: true,
        status: "NEED_ONBOARDING",
        message: "Profile setup is still incomplete.",
        token: onboardingToken,
      });
    }

    // CASE C: Fully Registered Existing User -> Direct Log In
    const sessionToken = jwt.sign(
      { id: user.id, email: user.email, phoneNumber: user.phoneNumber }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" } as any
    );

    return res.status(200).json({
      success: true,
      status: "SUCCESS",
      message: "Sign-in completed successfully",
      token: sessionToken,
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role
      }
    });

  } catch (error) {
    console.error("DEBUG GOOGLE OAUTH FLOW ERROR:", error);
    return res.status(500).json({ success: false, message: "Google authentication failed" });
  }
};


export const completeOAuthOnboarding = async (req: Request, res: Response) => {
  const { phoneNumber, securityQuestion, securityAnswer } = req.body || {};
  const authHeader = req.headers.authorization;

  try {
    if (!authHeader || !authHeader.startsWith("Bearer ")) return res.status(401).json({ success: false, message: "Session required" });
    if (!phoneNumber || !securityQuestion || !securityAnswer) return res.status(400).json({ success: false, message: "Missing profile fields" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    
    const userRepo = AppDataSource.getRepository(entity.User);
    const user = await userRepo.findOne({ where: { id: decoded.id } });
    if (!user) return res.status(404).json({ success: false, message: "Session user not found" });

    const duplicatePhone = await userRepo.findOne({ where: { phoneNumber } });
    if (duplicatePhone) return res.status(409).json({ success: false, message: "Phone number is already registered" });

    const salt = await bcrypt.genSalt(10);
    user.securityAnswer = await bcrypt.hash(securityAnswer.toLowerCase().trim(), salt);
    user.phoneNumber = phoneNumber;
    user.securityQuestion = securityQuestion;
    user.isComplete = true; // Complete the profile setup

    await userRepo.save(user);

    const standardSessionToken = jwt.sign({ id: user.id, email: user.email, phoneNumber: user.phoneNumber }, process.env.JWT_SECRET as string, { expiresIn: "1d" });
    return res.status(200).json({ success: true, message: "Profile finalized", token: standardSessionToken, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to finalize registration" });
  }
};