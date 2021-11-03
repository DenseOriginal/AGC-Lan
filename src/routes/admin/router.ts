import { Router } from "express";
import { isStaff } from "../../config/passport";
import { getAdmin } from "./admin";

export const AdminRouter = Router();

AdminRouter.use(isStaff);

AdminRouter.route('/').get(getAdmin);
