import { RequestHandler } from "express";
import { getNextLanAsObject } from "./lan/helper";

export const getIndex: RequestHandler = async (req, res) => {
  res.status(200).render('index', {
    user: req.user,
    nextLan: await getNextLanAsObject(),
    title: 'Home'
  });
}