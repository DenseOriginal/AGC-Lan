import { Router } from "express";
import { isSuperAdmin } from "../../../config/passport";
import { getCreate, postCreate } from "./create";
import { getList } from "./list";

export const LanRouter = Router();

LanRouter.route('/list').get(getList);

LanRouter.route('/create').get(isSuperAdmin, getCreate);
LanRouter.route('/create').post(isSuperAdmin, postCreate);