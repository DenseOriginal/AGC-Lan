import { RequestHandler } from "express";

export const getConstruction: RequestHandler = (req, res) => {
  return res.render('construction', { title: 'Kommer snart' });
}