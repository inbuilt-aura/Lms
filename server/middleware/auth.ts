require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "./catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";

export const isAuthenticated  = catchAsyncError(async(req: Request, res: Response, next: NextFunction) =>{
    const access_token = req.cookies.access_token as string;
    
    
    const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN as string) as JwtPayload;

    if(!decoded){
        return next(new ErrorHandler("access token is not valid", 400));
    }

    const user = await redis.get(decoded.id);

    if(!user){
        return next(new ErrorHandler("user not found", 400));
    }
    req.user = JSON.parse(user);

    next();
});