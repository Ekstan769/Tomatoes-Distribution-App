import { Request, Response } from "express";
<<<<<<< HEAD
import { registerUser, loginUser } from "../";
import { validateRegister } from "../";

export const register = async (req: Request, res: Response) => {
    try {
        const errors = validateRegister(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ success: false, errors });
        }
        const user = await registerUser(req.body);
        return res.status(201).json({ success: true, data: user });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const result = await loginUser(req.body);
        return res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        return res.status(401).json({ success: false, message: error.message })
    }
}

;
=======
import * as entity from "../entity";
import bcrypt from "bcrypt";
//import { logger } from '../../utils/logger';
import jwt from "jsonwebtoken";
import { AppDataSource } from '../../db/datasource';

/**
 * #swagger.tags = ['Authentication']
 * #swagger.parameters['body'] = {
 * in: 'body',
 * schema: { $fullName: 'John Doe', $email: 'john@example.com', $password: 'secret', $securityQuestion: 'Pet name?', $securityAnswer: 'Rex' }
 * }
 */

export const signUp = async (req: Request, res: Response) => {
  const { userName, phoneNumber, email, password, securityQuestion, securityAnswer } = req.body||{};
  try {
    // Ensure recovery fields are provided
    if (!userName || !email || !password || !securityQuestion || !securityAnswer) {
      return res.status(400).json({ message: "All fields, including security question and answer, are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email).toLowerCase())) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const userRepo = AppDataSource.getRepository(entity.User);
    const existingUser = await userRepo.findOne({ where: { email: email.toLowerCase() } });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash both the password AND the security answer (normalized to lowercase to avoid casing mismatches)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const hashedAnswer = await bcrypt.hash(securityAnswer.toLowerCase().trim(), salt);

    const created = userRepo.create({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      securityQuestion,
      securityAnswerHash: hashedAnswer,
    });
    const savedUser = await userRepo.save(created);
    
    const user = { id: savedUser.id, fullName: savedUser.fullName, email: savedUser.email };
    const info = { id: String(user.id), email: String(user.email) };

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ success: false, message: 'Server misconfiguration: auth secret missing' });
    }

    const token = jwt.sign(info, process.env.JWT_SECRET, {
      expiresIn: (process.env.JWT_EXPIRES_IN || "1d") as any,
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      user,
    });

  } catch (error: any) {
    logger.error({ err: error }, "Sign-up process failed unexpectedly");
    if (error?.code === '23505') {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }
    return res.status(500).json({ success: false, message: "Unexpected error: sign up failed." });
  }
}; // end of signUp

/**
 * #swagger.tags = ['Authentication']
 * #swagger.parameters['body'] = {
 * in: 'body',
 * schema: { $phoneNumber: '1234567890', $password: 'secret' }
 * }
 */
export const signIn = async (req: Request, res: Response) => {
  const { phoneNumber, password } = req.body||{};
  try {
    if (!phoneNumber || !password) {
      return res.status(400).json({
        success: false,
        message: "Number and password required"
      });
    }
    // find by phone using TypeORM
    const userRepo = AppDataSource.getRepository(entity.User);
    
    // Explicitly fetching password since it is marked as optional in userEntity
    const user = await userRepo.findOne({ where: { phoneNumber: phoneNumber }, select: { password: true } });

    // Added explicit password existence verification to satisfy TS compile constraints
    if (!user || !user.password) {
      return res.status(401).json({
        success: false,
        message: "Invalid number or password"
      });
    }
    
    const PasswordValid = await bcrypt.compare(password, user.password);
    if (!PasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid number or password"
      });
    }

    // Creating clean, simple object for the payload
    const info = {
      id: String(user.userId),      
      email: String(user.email),
      phoneNumber: String(user.phoneNumber)
    };

    //Pass the info and cast the options
    const token = jwt.sign(
      info, 
      process.env.JWT_SECRET as string, 
      { 
        expiresIn: (process.env.JWT_EXPIRES_IN || "1d") as any // 'any' bypasses strict type checking for the option
      }
    );

    return res.status(200).json({
      success: true,
      message: "Sign-in completed",
      token,
      user: {
        id: user.userId,
        phoneNumber: user.phoneNumber
      }, 
    });
  } catch (error) {
    //logger.error({ err: error }, "#panic sign in process failed");

    return res.status(500).json({
      success: false,
      message: "unexpected server error"
    });
  }
};


// GET USER'S RECOVERY QUESTION
/**
 * #swagger.tags = ['Authentication']
 * #swagger.parameters['body'] = {
 * in: 'body',
 * schema: { $email: 'john@example.com' }
 * }
 */

export const getRecoveryQuestion = async (req: Request, res: Response) => {
  // #swagger.tags = ['Authentication']
  const { email } = req.body||{};

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const userRepo = AppDataSource.getRepository(entity.User);
    const user = await userRepo.findOne({ where: { email: email.toLowerCase() } });

    if (!user || !user.securityQuestion) {
      return res.status(404).json({ message: "No security question configured for this user" });
    }

    return res.status(200).json({
      success: true,
      securityQuestion: user.securityQuestion,
    });
  } catch (error) {
    //logger.error({ err: error }, "Failed to retrieve recovery question");
    return res.status(500).json({ message: "Internal server error" });
  }
};


// TO RESET PASSWORD USING SECURITY ANSWER
/**
 * #swagger.tags = ['Authentication']
 * #swagger.parameters['body'] = {
 * in: 'body',
 * schema: { $email: 'john@example.com', $securityAnswer: 'Rex', $newPassword: 'newSecretPassword' }
 * }
 */
export const resetPassword = async (req: Request, res: Response) => {
  const { email, securityAnswer, newPassword } = req.body||{};

  try {
    if (!email || !securityAnswer || !newPassword) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const userRepo = AppDataSource.getRepository(entity.User);
    
    // Explicitly select only necessary fields
    const user = await userRepo.findOne({ 
      where: { email: email.toLowerCase() },
      select: {
        userId: true,
        password: true,
        securityAnswer: true
      }
    });

    const genericError = "Invalid credentials or recovery parameters";

    // Verify user exists and has a recovery hash
    if (!user || !user.securityAnswer) {
      return res.status(401).json({ message: genericError });
    }

    //Verify security answer
    const isAnswerCorrect = await bcrypt.compare(
      securityAnswer.toLowerCase().trim(),
      user.securityAnswer
    );

    if (!isAnswerCorrect) {
      return res.status(401).json({ message: genericError });
    }

    // Prevent immediate reuse of the same password
    const isSamePassword = await bcrypt.compare(newPassword, user.password || "");
    if (isSamePassword) {
      return res.status(400).json({ message: "New password cannot be the same as the old one" });
    }

    // 4. Update and Save
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await userRepo.save(user);

    return res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    //logger.error({ err: error }, "Password reset failed");
    return res.status(500).json({ message: "Internal server error" });
  }
};

//oAuth logic to be added
>>>>>>> upstream/main
