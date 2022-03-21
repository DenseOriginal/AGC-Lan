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
        username: profile.username + '#' + profile._json.discriminator,
        refresh_token: refreshToken,
        // If th user doesn't have a profile picture, give them the default discord pfp
        picture_url: primaryPhoto?.value || "https://cdn.discordapp.com/embed/avatars/3.png",
        discord_id: profile.id,
        accent_color: (profile._json as any).banner_color || `hsla(${~~(360 * Math.random())},70%,70%,0.8)`,
      });

      await newPartial.save();
      
      // If we succesfully created a partial user, then return that
      return cb(null, newPartial.toObject());
    } else {
      const primaryPhoto = profile.photos?.find(photo => photo.primary) || profile.photos?.[0];

      // Otherwise if a user was found
      // Then update the last_login with now, and the refresh_token
      // And the refresh the data pulled from discord, as the user might have changed their profile
      await user.updateOne({
        last_login: new Date,
        refresh_token: refreshToken,
        username: profile.username + '#' + profile._json.discriminator,
        picture_url: primaryPhoto?.value || "https://cdn.discordapp.com/embed/avatars/3.png",
        accent_color: (profile._json as any).banner_color || `hsla(${~~(360 * Math.random())},70%,70%,0.8)`,
      }).exec();

      // And then return the user
      return cb(null, user.toObject());
    }
  } catch (error) {
    // If any error happened then return chat
    return cb(error as any);
  }
}));

export type RoleType = "USER" | "STAFF" | "ADMIN" | "SUPERADMIN";
export const roles: { [index: string]: number } = {
  USER: 0,
  STAFF: 1,
  ADMIN: 2,
  SUPERADMIN: 3,
};

// Checks
export const isStaff = (user: IUser | undefined) => {
  return !!user && roles[user.role] > 0;
}

export const isAdmin = (user: IUser | undefined) => {
  return !!user && roles[user.role] > 1;
}

export const isSuperAdmin = (user: IUser | undefined) => {
  return !!user && roles[user.role] > 2;
}