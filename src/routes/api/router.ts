import { Router } from "express";
import passport from "passport";
import { getEventEventSource, getLanEventSource } from "./calendar";
import { callback } from "./callback";

export const ApiRouter = Router();

// Routes used for discord authentication
ApiRouter.route('/login').get(passport.authenticate('discord'));
ApiRouter.route('/callback').get(passport.authenticate('discord', {
  failureRedirect: '/acces-denied'
}), callback);

// Calendar routes
ApiRouter.route('/calendar/lan').get(getLanEventSource);
ApiRouter.route('/calendar/event').get(getEventEventSource);

// Other api routes