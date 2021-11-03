import { RequestHandler } from "express";

export const callback: RequestHandler = (req, res) => {
  res.redirect((req.session as any).returnTo || '/');
};