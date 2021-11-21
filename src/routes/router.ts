import { Router } from "express";
import { getIndex } from ".";
import { isAuthenticated, notAuthenticated } from "../config/guards";
import { ApiRouter } from "./api/router";
import { getLogin } from "./login";
import { getPolicy } from "./policy";
import { ProfileRouter } from "./profile/router";
import { getUser } from "./_userId";
import { LanRouter } from "./lan/router";
import { getFaq } from "./faq";
import { getCalendar } from "./calendar";

export const RootRouter = Router();

// Routes at the root level
RootRouter.route("/").get(getIndex);
RootRouter.route("/login").get(notAuthenticated, getLogin);
RootRouter.route("/logout").get((req, res) => { req.logOut(); res.redirect('/'); });
RootRouter.route("/policy").get(getPolicy);
RootRouter.route("/user/:id").get(isAuthenticated, getUser);
RootRouter.route("/faq").get(getFaq);
RootRouter.route("/kalender").get(getCalendar);

// Other routers
RootRouter.use("/api", ApiRouter);
RootRouter.use("/", ProfileRouter);
RootRouter.use("/lan", LanRouter);

// 404 to catch every request not handled by anything else
RootRouter.use("**", (req, res) => res.status(404).render('404', { title: "404", noHeader: true }));