require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import userModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { catchAsyncError } from "../middleware/catchAsyncError";
import jwt, { Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import {sendToken} from "../utils/jwt";
import { redis } from "../utils/redis";
// register user

interface IRegistration {
  username: string;
  email: string;
  password: string;
  avatar?: string;
}
export const registerUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, email, password } = req.body;
      const isEmailExists = await userModel.findOne({ email });

      if (isEmailExists) {
        return next(new ErrorHandler("Email already exists", 400));
      }

      const user: IRegistration = {
        username,
        email,
        password,
      };

      const activationToken = createActivationToken(user);

      const activationCode = activationToken.activationCode;

      const data = { user: { username: user.username }, activationCode };
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/activationMail.ejs"),
        data
      );
      try {
        await sendMail({
          email: user.email,
          subject: "Activate your account",
          template: "activationMail.ejs",
          data,
        });

        res.status(201).json({
          success: true,
          message: `Please check your email: ${user.email} to activate your account.`,
          activationToken: activationToken.token,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface IActivationToken {
  token: string;
  activationCode: string;
}

export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() + 9000).toString();

  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.ACTIVATION_TOKEN as Secret,
    {
      expiresIn: "5m",
    }
  );
  return { token, activationCode };
};

// activate user

interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}
export const activateUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IActivationRequest;

      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_TOKEN as string
      ) as { user: IUser; activationCode: string };

      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code", 400));
      }

      const { username, email, password } = newUser.user;

      const existUser = await userModel.findOne({ email });

      if (existUser) {
        return next(new ErrorHandler("Email already exists", 400));
      }

      const user = await userModel.create({
        username,
        email,
        password,
      });

      res.status(200).json({
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// login user

interface ILoginAccess {
  email: string;
  password: string;

 }

 export const loginUser= catchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
try {
  const {email, password} = req.body as ILoginAccess;
  if(!email ||  !password){
    return next(new ErrorHandler("Please enter email and password", 400));
  };
  const user= await userModel.findOne({ email}).select("password");

  if(!user){
    return next(new ErrorHandler("Invalid email or password", 400));
  };

  const isPasswordMatch = await user.comparePassword(password);
  if(!isPasswordMatch){
    return next(new ErrorHandler("Invalid  email or password", 400));  
  };
  sendToken(user,200,res);
} catch (error:any) {
  return next(new  ErrorHandler(error.message,400));
}
 })

 // lOGOUT USER

 export const logoutUser= catchAsyncError(
  async (req:Request, res:Response, next:NextFunction) =>{
try {
  res.cookie("access_token", "", {maxAge:1});
  res.cookie("refresh_token", "", {maxAge:1});
// delete data from redis database
  const userId = req.user?._id || "";
  // console.log(req.user);    
  redis.del(userId);
  res.status(200).json({
    suceess:true,
    message:"Logged out successfully",
  });

} catch (error:any) {
  return next(new ErrorHandler(error.message, 400));
}
  }
 );