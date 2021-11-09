import { Router } from "express";
import { isStaff } from "../../config/passport";
import { getStaff } from "./staff";
import { getUsers } from "./users";

export const StaffRouter = Router();

// All staff routes are protected by the isStaff guard
StaffRouter.use(isStaff);

// Staff routes
StaffRouter.route('/').get(getStaff);
StaffRouter.route('/users').get(getUsers); // /users?filter&direction
