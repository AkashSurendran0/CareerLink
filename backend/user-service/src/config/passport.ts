import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth20";
import { GoogleLogin } from "../application/use-cases/GoogleLogin";
import { UserRepository } from "../infrastructure/repositories/UserRepository";
import dotenv from "dotenv";

dotenv.config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            callbackURL: process.env.GOOGLE_CALLBACK_URL || "",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const googleUser = {
                    email: profile.emails?.[0]?.value ?? "",
                    username: profile.displayName,
                    googleId: profile.id
                };
                const googleLogin = new GoogleLogin(new UserRepository());
                const user = await googleLogin.googleSignin(googleUser.email, googleUser.googleId, googleUser.username);
                return done(null, user);
            } catch (error: unknown) {
                if (error instanceof Error) return done(error, false);
                return done(new Error("Unknown passport error"), false);
            }
        }
    )
);

passport.serializeUser((user: unknown, done) => {
  done(null, user);
});

passport.deserializeUser((obj: unknown, done) => {
  done(null, obj);
});