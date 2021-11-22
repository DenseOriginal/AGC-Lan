import { Router } from "express";
import { isAuthenticated, isAwaitingSetup } from "../../config/guards";
import { getDelete } from "./delete";
import { getProfile } from "./profile";
import { getSetup, postSetup } from "./setup";

export const ProfileRouter = Router();

// Profile routes
ProfileRouter.route('/profile').get(isAuthenticated, getProfile);
ProfileRouter.route('/profile/setup').get(isAwaitingSetup, getSetup);
ProfileRouter.route('/profile/setup').post(isAwaitingSetup, postSetup);
ProfileRouter.route('/profile/delete').post(isAuthenticated, getDelete);