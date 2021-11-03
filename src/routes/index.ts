import { RequestHandler } from "express";

export const getIndex: RequestHandler = (req, res) => {
  res.status(200).render('index', { user: req.user });
}