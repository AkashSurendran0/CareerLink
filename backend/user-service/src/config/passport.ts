import passport from 'passport'
import {Strategy as GoogleStrategy} from 'passport-google-oauth20'
import { GoogleLogin } from '../application/use-cases/GoogleLogin'
import { UserRepository } from '../infrastructure/database/UserRepository'
import dotenv from 'dotenv'

dotenv.config()

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            callbackURL: '/google/callback'
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const googleUser={
                    email: profile.emails?.[0]?.value ?? "",
                    username: profile.displayName,
                    googleId: profile.id
                }
                const googleLogin=new GoogleLogin(new UserRepository())
                const user=await googleLogin.googleSignin(googleUser.email, googleUser.googleId, googleUser.username)
                return done(null, user)
            } catch (error:any) {
                return done(error, false)
            }
        }
    )
)

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((obj: any, done) => {
  done(null, obj);
});