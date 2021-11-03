import { RequestHandler } from "express";

export const getProfile: RequestHandler = (req, res) => {
  res.status(200).render('profile', { user: req.user, title: "Profile" });
};