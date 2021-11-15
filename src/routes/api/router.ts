import { Router } from "express";
import passport from "passport";
import { callback } from "./callback";

export const ApiRouter = Router();

// Routes used for discord authentication
ApiRouter.route('/login').get(passport.authenticate('discord'));
ApiRouter.route('/callback').get(passport.authenticate('discord'), callback);

// Other api routes