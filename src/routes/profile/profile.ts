import { randomBytes } from "crypto";
import { RequestHandler } from "express";

export const getProfile: RequestHandler = (req, res) => {
  // Generate a csrf token, which is just a random string
  // This is used to make sure that it's the user that wanted to delete their account
  // And that they weren't tricked somehow
  const csrfToken = randomBytes(64).toString('hex');

  // Save the token in the session
  (req as any).session['csrf_token'] = csrfToken;

  // Send something to the user
  res.status(200).render('profile/profile', { user: req.user, title: "Profile", csrfToken });
};