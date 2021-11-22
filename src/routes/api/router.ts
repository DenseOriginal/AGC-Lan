import { Router } from "express";
import passport from "passport";
import { getLanEventSource } from "./calendar";
import { callback } from "./callback";

export const ApiRouter = Router();

// Routes used for discord authentication
ApiRouter.route('/login').get(passport.authenticate('discord'));
ApiRouter.route('/callback').get(passport.authenticate('discord'), callback);

// Calendar routes
ApiRouter.route('/calendar/lan').get(getLanEventSource);

// Other api routes