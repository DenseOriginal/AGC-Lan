import { Router } from "express";
import passport from "passport";
import { callback } from "./callback";

export const ApiRouter = Router();

ApiRouter.route('/login').get(passport.authenticate('discord'));
ApiRouter.route('/callback').get(passport.authenticate('discord'), callback);