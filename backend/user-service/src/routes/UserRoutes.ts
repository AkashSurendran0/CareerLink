import { Router } from "express";
import { UserController } from "../interfaces/controllers/UserController";
import passport from "passport";
import { UserDetailsController } from "../interfaces/controllers/UserDetailsController";
import container from "../inversify.config";
import { TYPES } from "../types";
import multer from "multer";
import dotenv from "dotenv";
import { createAccessToken, createRefreshToken } from "../utils/SetToken";

dotenv.config();  
const router=Router();
const userController=container.get<UserController>(TYPES.UserController);
const userDetailsController=container.get<UserDetailsController>(TYPES.UserDetailsController);
const upload=multer();


router.post("/login", userController.login);
router.post("/signup", userController.signup);
router.post("/sendOTP", userController.sendOtp);
router.get(
    "/google", 
    passport.authenticate("google", {scope:["profile", "email"]})
);
router.get(
    "/google/callback",
    passport.authenticate("google", {failureRedirect:"/login"}),
    async (req, res)=>{
        const user=req.user;
        const accessToken=await createAccessToken(user!.id, user!.email);
        const refreshToken=await createRefreshToken(user!.id, user!.email);
        res.cookie("token", accessToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: Number(process.env.MAX_AGE_1_HOUR), 
        });
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: Number(process.env.MAX_AGE_1_WEEK),
        });
        res.redirect("http://localhost:3000/feed");
    }
);
router.post("/changePassword", userController.changePassword);
router.post("/sendResetOTP", userController.sendPassResetOtp);
router.get("/getUsers", userController.getPageUsers);
router.post("/addUserDetails", userDetailsController.insertUserDetails);
router.get("/getUserDetails", userDetailsController.queryUserDetails);
router.patch("/editUserDetails", upload.single("profilePicture"), userDetailsController.modifyUserDetails);
router.patch("/alterUserStatus", userController.changeUserStatus);
router.get("/check", userController.checkBlock);
router.get("/getOTP", userController.verifyOTP);
router.get("/getDetailsByQuery", userController.getUserDetails);
router.get("/getDetailsByEmail", userController.getUserDetailsByEmail);
router.get("/getUserInfo", userController.getUserInfo);
router.get("/getGithubData", userDetailsController.getGithubData)
router.get("/getGithubActivity", userDetailsController.getGithubActivity)

export default router;