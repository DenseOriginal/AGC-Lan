import { Router } from "express";
import { getCreate, postCreate } from "./create";
import { getList } from "./list";
import { getLan } from "./_id";

export const LanRouter = Router();

LanRouter.route('/list').get(getList);

// TODO: remove this
// LanRouter.route('/create').get(isSuperAdmin, getCreate);
// LanRouter.route('/create').post(isSuperAdmin, postCreate);

// This need to be last to not catch all the other routes
LanRouter.route('/:lanId').get(getLan);