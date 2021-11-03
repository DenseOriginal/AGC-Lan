import { RequestHandler } from "express";

export const getStaff: RequestHandler = (req, res) => {
  res.render('staff', { user: req.user, title: "Staff" });
}