import { RequestHandler } from "express";

export const getDiscord: RequestHandler = (req, res) => {
  res.render('discord', {
    title: 'Discord',
    user: req.user
  });
}