import { Router } from "express";
import { getIndex } from ".";
import { notAuthenticated } from "../config/passport";
import { ApiRouter } from "./api/router";
import { getLogin } from "./login";
import { getPolicy } from "./policy";
import { ProfileRouter } from "./profile/router";

export const RootRouter = Router();

RootRouter.route("/").get(getIndex);
RootRouter.route("/login").get(notAuthenticated, getLogin);
RootRouter.route("/logout").get((req, res) => { req.logOut(); res.redirect('/'); });
RootRouter.route("/policy").get(getPolicy);

// Other routers
RootRouter.use("/api", ApiRouter);
RootRouter.use("/", ProfileRouter);

// 404
RootRouter.use("**", (req, res) => res.status(404).render('404', { title: "404", noHeader: true }));