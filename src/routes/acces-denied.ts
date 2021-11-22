import { RequestHandler } from "express";

export const getAccesDenied: RequestHandler = (req, res) => {
  res.render('error', { title: 'Ingen adgang', user: req.user, header: 'Fejl', error: 'Du har ikke givet adgang til at logge ind' });
}