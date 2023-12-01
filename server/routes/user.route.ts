import express from "express";
import {activateUser, registerUser,loginUser,logoutUser,deleteUser,updateUserProfile, resetPasswordRequest, resetPassword, validateRoles, updateAccessToken} from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/auth";

const router= express.Router();

router.post("/signup", registerUser);

router.post("/activate-user", activateUser);

router.post("/resetpasswordrequest", resetPasswordRequest);

router.post("/resetpassword/:userId/:token", resetPassword);

router.post("/login", loginUser);

router.get("/logout",isAuthenticated, logoutUser);
router.get("/refresh",updateAccessToken);
router.get('/delete-user', isAuthenticated, deleteUser);
router.put('/update-user', isAuthenticated, updateUserProfile);

export default router;                 
