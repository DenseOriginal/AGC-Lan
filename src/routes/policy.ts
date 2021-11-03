import { RequestHandler } from "express";

export const getPolicy: RequestHandler = (req, res) => {
  res.status(200).render('policy', { noHeader: true });
}