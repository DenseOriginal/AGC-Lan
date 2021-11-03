import { Router } from "express";
import { isStaff } from "../../config/passport";
import { getStaff } from "./staff";
import { getUsers } from "./users";

export const StaffRouter = Router();

StaffRouter.use(isStaff);

StaffRouter.route('/').get(getStaff);
StaffRouter.route('/users').get(getUsers); // /users?filter&direction