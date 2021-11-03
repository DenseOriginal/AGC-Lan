import { RequestHandler } from "express";

export const getLogin: RequestHandler = (req, res) => {
  res.status(200).render('login', { title: "Login", noHeader: true });
}