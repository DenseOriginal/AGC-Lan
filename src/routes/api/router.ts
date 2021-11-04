import { Router } from "express";
import passport from "passport";
import { isAdmin } from "../../config/passport";
import { postAddAdmin, postRemoveAdmin } from "./admin";
import { callback } from "./callback";
import { postAddStaff, postRemoveStaff } from "./staff";

export const ApiRouter = Router();

// Routes used for discord authentication
ApiRouter.route('/login').get(passport.authenticate('discord'));
ApiRouter.route('/callback').get(passport.authenticate('discord'), callback);

// Other api routes
ApiRouter.route('/add-staff').post(isAdmin, postAddStaff);
ApiRouter.route('/remove-staff').post(isAdmin, postRemoveStaff);
ApiRouter.route('/add-admin').post(isAdmin, postAddAdmin);
ApiRouter.route('/remove-admin').post(isAdmin, postRemoveAdmin);