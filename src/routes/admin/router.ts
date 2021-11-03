import { Router } from "express";
import { isStaff } from "../../config/passport";
import { getAdmin } from "./admin";
import { getUsers } from "./users";

export const AdminRouter = Router();

AdminRouter.use(isStaff);

AdminRouter.route('/').get(getAdmin);
AdminRouter.route('/users').get(getUsers); // /users?filter&direction