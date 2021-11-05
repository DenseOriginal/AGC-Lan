import { RequestHandler } from "express";
import { LanModel } from "../../../models/lan";

// The info we want about the new LAN
const infoToCollect = [
  { name: "name", placeholder: "Navn", type: "text", previousValue: "", error: "" },
  { name: "description", placeholder: "Beskrivelse", type: "text", previousValue: "", error: "" },
  { name: "start", placeholder: "Start", type: "date", previousValue: "", error: "" },
  { name: "end", placeholder: "Slut", type: "date", previousValue: "", error: "" },
  { name: "price", placeholder: "Pris", type: "number", previousValue: "", error: "" },
];

export const getCreate: RequestHandler = (req, res) => {
  res.render('lan/create', {
    title: 'Opret LAN',
    user: req.user,
    infoToCollect
  });
}

export const postCreate: RequestHandler = async (req, res) => {
  try {
    const newLan = new LanModel(req.body);
    await newLan.save();

    res.render('lan/create', {
      title: 'Succes',
      user: req.user,
      message: 'Nyt lan oprettet',
      logLevel: 'info'
    })
  } catch (error) {
    console.error(error);

    res.render('lan/create', {
      title: 'Fejl',
      user: req.user,
      message: 'Der er sket en fejl',
      logLevel: 'warn'
    })
  }

}