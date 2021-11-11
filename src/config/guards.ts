import { RequestHandler } from "express";
import { roles } from "./passport";

export const isNotBanned: RequestHandler = (req, res, next) => {
  // If the user is banned, redirect them to a banned page
  if(req.isAuthenticated() && req.user.banned) return res.render('banned', {
    title: "Banned",
    noHeader: true,
  })
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    if(!req.user.setup_finished) {
      // If the user is logged in, but not setup, then redirect them
      return res.redirect('/profile/setup');
    }

    // Otherwise of the user is setup then let them pass
    return next();
  }

  // If the user isn't signed in, save the returnTo url, so we can redirect them back at some other point
  (req.session as any).returnTo = req.originalUrl;
  res.redirect("/login");
};

export const isAwaitingSetup: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated() && !req.user.setup_finished) {
    return next();
  }

  // If the user isn't logged in, save the returnTo url, so we can redirect them back at some other point
  (req.session as any).returnTo = req.originalUrl;
  res.redirect("/login");
};

export const notAuthenticated: RequestHandler = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }

  res.redirect("/profile");
};

export const requestGuardIsStaff: RequestHandler = (req, res, next) => {
  if(req.isAuthenticated() && roles[req.user.role] > 0) {
    return next();
  }
  return res.redirect("/");
}

export const requestGuardIsAdmin: RequestHandler = (req, res, next) => {
  if(req.isAuthenticated() && roles[req.user.role] > 1) {
    return next();
  }
  return res.redirect("/");
}

export const requestGuardIsSuperAdmin: RequestHandler = (req, res, next) => {
  if(req.isAuthenticated() && roles[req.user.role] > 2) {
    return next();
  }
  return res.redirect("/");
}