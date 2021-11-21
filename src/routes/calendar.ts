import { RequestHandler } from "express";

export const getCalendar: RequestHandler = (req, res) => {
  res.render('calendar', { title: 'Kalender', user: req.user });
}