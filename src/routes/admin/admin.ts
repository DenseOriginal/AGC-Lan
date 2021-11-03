import { RequestHandler } from "express";

export const getAdmin: RequestHandler = (req, res) => {
  res.render('admin', { title: "Admin" });
}