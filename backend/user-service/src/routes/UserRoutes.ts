import { Router } from "express";
import { UserController } from "../interfaces/controllers/UserController";
import passport from "passport";
import { UserDetailsController } from "../interfaces/controllers/UserDetailsController";
// import upload from "../middlewares/upload";
import container from "../inversify.config";
import { TYPES } from "../types";
import multer from "multer";


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
    (req, res)=>{
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

export default router;