import { Scope, Profile, Strategy, VerifyCallback } from "@oauth-everything/passport-discord";
import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { PartialUserModel } from "../models/partial-user";
import { IUser, UserModel } from "../models/user";

// Serialize the user using ther discord_id
// This is so that we can deserialize to both a user and partialUser
passport.serializeUser((user: IUser, done) => {
  done(null, user.discord_id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    // If we find a user then return that as an object
    const user = await UserModel.findOne({ "discord_id": id }).exec();
    if(user) return done(null, user.toObject());

    // If we didn't find a user, look for a partial user, and return that as an object
    const partialUser = await PartialUserModel.findOne({ "discord_id": id }).exec();
    if(partialUser) return done(null, partialUser.toObject() as any);

    // Otherwise if no user was found, say that;
    return done('No user found', null);
  } catch (error) {
    // If an error happened return that
    return done(error);
  }
});

// Setup new passport strategy
passport.use(new Strategy({
  clientID: process.env.CLIENT_ID as string,
  clientSecret: process.env.CLIENT_SECRET as string,
  callbackURL: process.env.CALLBACK_URL as string,
  scope: [Scope.IDENTIFY, Scope.EMAIL]
}, async (accessToken: string, refreshToken: string, profile: Profile, cb: VerifyCallback<any>) => {
  try {
    // Check if the user already exist
    const user = await UserModel.findOne({ "discord_id": profile.id }).exec();


    if(!user) {
      // If user doesn't exist, check if a partial user exist
      const partialUser = await PartialUserModel.findOne({ "discord_id": profile.id }).exec();

      if(partialUser) {
        return cb(null, partialUser.toObject());
      }

      // If partial user doesnt exist, then create a new partial

      // Get the email and photo, in advance
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
        accent_color: (profile._json as any).banner_color || `hsla(${~~(360 * Math.random())},70%,70%,0.8)`,
      });

      await newPartial.save();
      
      // If we succesfully created a partial user, then return that
      return cb(null, newPartial.toObject());
    } else {
      // Otherwise if a user was found
      // Then update the last_login with now, and the refresh_token
      await user.updateOne({
        last_login: new Date,
        refresh_token: refreshToken,
      }).exec();

      // And then return the user
      return cb(null, user.toObject());
    }
  } catch (error) {
    // If any error happened then return chat
    return cb(error as any);
  }
}));

// Guards
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    if(!req.user.setup_finished) {
      // If the user is logged in, but not setup, then redirect them
      return res.redirect('/profile/setup');
    }

    // Otherwise of the user is setup then let them pass
    return next();
  }

  // If the user isn't signed in, save the returnTo url, so we can redirect them back at some other point
  (req.session as any).returnTo = req.originalUrl;
  res.redirect("/login");
};

export const isAwaitingSetup = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && !req.user.setup_finished) {
    return next();
  }

  // If the user isn't logged in, save the returnTo url, so we can redirect them back at some other point
  (req.session as any).returnTo = req.originalUrl;
  res.redirect("/login");
};

export const notAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return next();
  }

  res.redirect("/profile");
};

export type RoleType = "USER" | "STAFF" | "ADMIN" | "SUPERADMIN";
export const roles: { [index: string]: number } = {
  USER: 0,
  STAFF: 1,
  ADMIN: 2,
  SUPERADMIN: 3,
};

// Checks
export const isStaff = (user: IUser) => {
  return roles[user.role] > 0;
}

export const isAdmin = (user: IUser) => {
  return roles[user.role] > 1;
}

export const isSuperAdmin = (user: IUser) => {
  return roles[user.role] > 2;
}

// Request guards
export const requestGuardIsStaff = (req: Request, res: Response, next: NextFunction) => {
  if(req.isAuthenticated() && roles[req.user.role] > 0) {
    return next();
  }
  return res.redirect("/");
}

export const requestGuardIsAdmin = (req: Request, res: Response, next: NextFunction) => {
  if(req.isAuthenticated() && roles[req.user.role] > 1) {
    return next();
  }
  return res.redirect("/");
}

export const requestGuardIsSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  if(req.isAuthenticated() && roles[req.user.role] > 2) {
    return next();
  }
  return res.redirect("/");
}