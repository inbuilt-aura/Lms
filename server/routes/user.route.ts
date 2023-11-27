import express from "express";
import {activateUser, registerUser,loginUser,logoutUser,deleteUser,updateUserProfile} from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/auth";

const router= express.Router();

router.post("/signup", registerUser);

router.post("/activate-user", activateUser);

router.post("/login", loginUser);

router.get("/logout",isAuthenticated, logoutUser);
router.get('/delete-user', isAuthenticated, deleteUser);
router.put('/update-user', isAuthenticated, updateUserProfile);

export default router;                 
