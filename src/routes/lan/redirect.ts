import { RequestHandler } from "express";
import { getNextLanAsObject } from "./helper";

export const redirectToCurrentTilmeld: RequestHandler = async (req, res) => {
  try {
    const lan = await getNextLanAsObject();
    res.redirect(`/lan/${lan._id}/tilmeld`);
  } catch (error) {
    res.render('error', {
      title: 'Error',
      user: req.user,
      error: "Der er sket en uventet fejl, prøv igen senere"
    });
  }
}

export const redirectToCurrentFrameld: RequestHandler = async (req, res) => {
  try {
    const lan = await getNextLanAsObject();
    res.redirect(`/lan/${lan._id}/frameld`);
  } catch (error) {
    res.render('error', {
      title: 'Error',
      user: req.user,
      error: "Der er sket en uventet fejl, prøv igen senere"
    });
  }
}