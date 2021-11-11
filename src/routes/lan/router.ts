import { Router } from "express";
import { isAuthenticated, isSuperAdmin } from "../../config/passport";
import { getCreate, postCreate } from "./create";
import { getList } from "./list";
import { getTilmeld, postTilmeld } from "./tilmeld";
import { getLan } from "./_id";

export const LanRouter = Router();

LanRouter.route('/list').get(getList);

// TODO: remove this
// LanRouter.route('/create').get(isSuperAdmin, getCreate);
// LanRouter.route('/create').post(isSuperAdmin, postCreate);

// This need to be last to not catch all the other routes
LanRouter.route('/:lanId').get(getLan);
LanRouter.route('/:lanId/tilmeld').get(isAuthenticated, getTilmeld); // TODO: check if user is banned
LanRouter.route('/:lanId/tilmeld').post(isAuthenticated, postTilmeld); // TODO: check if user is banned