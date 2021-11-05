import { Router } from "express";
import { getList } from "./list";

export const LanRouter = Router();

LanRouter.route('/list').get(getList);