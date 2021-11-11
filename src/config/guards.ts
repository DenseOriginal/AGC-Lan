import { RequestHandler } from "express";

export const isNotBanned: RequestHandler = (req, res, next) => {
  // If the user is banned, redirect them to a banned page
  if(req.isAuthenticated() && req.user.banned) return res.render('banned', {
    title: "Banned",
    noHeader: true,
  })
}