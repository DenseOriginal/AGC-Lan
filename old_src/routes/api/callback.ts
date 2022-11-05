import { RequestHandler } from "express";

// Route that discord calls when login happens
export const callback: RequestHandler = (req, res) => {
  // If the user isn't setup, redirect them to /profile/setup
  if(!req.user?.setup_finished) return res.redirect('/profile/setup');

  // Otherwise send them to were the came from or "/"
  return res.redirect((req.session as any).returnTo || '/');
};