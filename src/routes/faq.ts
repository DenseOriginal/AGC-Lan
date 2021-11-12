import { RequestHandler } from "express";

export const getFaq: RequestHandler = (req, res) => res.render('faq', { title: 'FAQ', user: req.user });