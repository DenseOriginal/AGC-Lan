import { RequestHandler } from "express";

export const callback: RequestHandler = (req, res) => { 
  if(!req.user?.setup_finished) return res.redirect('/profile/setup');
  return res.redirect((req.session as any).returnTo || '/');
};