import { Router } from "express";
import { isNotBanned } from "../../config/guards";
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
LanRouter.route('/:lanId/tilmeld').get(isAuthenticated, isNotBanned, getTilmeld);
LanRouter.route('/:lanId/tilmeld').post(isAuthenticated, isNotBanned, postTilmeld);