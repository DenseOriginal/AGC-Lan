import { Scope, Profile, Strategy, VerifyCallback } from "@oauth-everything/passport-discord";
import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { PartialUserModel } from "../models/partial-user";
import { IUser, UserModel } from "../models/user";

passport.serializeUser((user: IUser, done) => {
  done(null, user.discord_id);
});

passport.deserializeUser(async (id: string, done) => {
  console.log('Deserialize, ', id);
  
  try {
    const user = await UserModel.findOne({ "discord_id": id }).exec();
    if(user) return done(null, user.toObject());

    const partialUser = await PartialUserModel.findOne({ "discord_id": id }).exec();
    if(partialUser) return done(null, partialUser.toObject() as any);

    done(null, null);
  } catch (error) {
    done(error);
  }
});

passport.use(new Strategy({
  clientID: process.env.CLIENT_ID as string,
  clientSecret: process.env.CLIENT_SECRET as string,
  callbackURL: process.env.CALLBACK_URL as string,
  scope: [Scope.IDENTIFY, Scope.EMAIL]
}, async (accessToken: string, refreshToken: string, profile: Profile, cb: VerifyCallback<any>) => {
  try {
    const user = await UserModel.findOne({ "discord_id": profile.id }).exec();

    if(!user) {
      // If user doesn't exist, check if a partial user exist

      const partialUser = await PartialUserModel.findOne({ "discord_id": profile.id }).exec();

      if(partialUser) {
        return cb(null, partialUser.toObject());
      }
      // If partial user doesnt exist, then create a new partial

      const primaryEmail = profile.emails?.find(email => email.primary) || profile.emails?.[0];
      const primaryPhoto = profile.photos?.find(photo => photo.primary) || profile.photos?.[0];

      // Create partial user if no user exists
      const newPartial = new PartialUserModel({
        email: primaryEmail?.value,
        is_email_verified: primaryEmail?.verified,
        username: profile.username,
        refresh_token: refreshToken,
        picture_url: primaryPhoto?.value,
        discord_id: profile.id,
      });

      await newPartial.save();
      
      return cb(null, newPartial.toObject());
    } else {
      await user.updateOne({
        last_login: new Date,
        refresh_token: refreshToken,
      }).exec();
      return cb(null, user.toObject());
    }
  } catch (error) {
    return cb(error as any);
  }
}));

// Guards
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    if(!req.user.setup_finished) {
      res.redirect('/profile/setup');
      return;
    }
    return next();
  }

  (req.session as any).returnTo = req.originalUrl;
  res.redirect("/login");
};

export const isAwaitingSetup = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && !req.user.setup_finished) {
    return next();
  }

  (req.session as any).returnTo = req.originalUrl;
  res.redirect("/login");
};

export const notAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return next();
  }

  res.redirect("/profile");
};