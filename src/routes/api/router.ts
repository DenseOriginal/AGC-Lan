import { Router } from "express";
import passport from "passport";
import { isAdmin } from "../../config/passport";
import { callback } from "./callback";
import { postAddStaff, postRemoveStaff } from "./staff";

export const ApiRouter = Router();

ApiRouter.route('/login').get(passport.authenticate('discord'));
ApiRouter.route('/callback').get(passport.authenticate('discord'), callback);

ApiRouter.route('/add-staff').post(isAdmin, postAddStaff)
ApiRouter.route('/remove-staff').post(isAdmin, postRemoveStaff)