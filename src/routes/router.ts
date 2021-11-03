import { Router } from "express";
import { getIndex } from ".";
import { isAuthenticated, notAuthenticated } from "../config/passport";
import { StaffRouter } from "./staff/router";
import { ApiRouter } from "./api/router";
import { getLogin } from "./login";
import { getPolicy } from "./policy";
import { ProfileRouter } from "./profile/router";
import { getUser } from "./find-user";

export const RootRouter = Router();

RootRouter.route("/").get(getIndex);
RootRouter.route("/login").get(notAuthenticated, getLogin);
RootRouter.route("/logout").get((req, res) => { req.logOut(); res.redirect('/'); });
RootRouter.route("/policy").get(getPolicy);
RootRouter.route("/user/:id").get(isAuthenticated, getUser);

// Other routers
RootRouter.use("/api", ApiRouter);
RootRouter.use("/", ProfileRouter);
RootRouter.use("/staff", StaffRouter);

// 404
RootRouter.use("**", (req, res) => res.status(404).render('404', { title: "404", noHeader: true }));