import { RequestHandler } from "express";
import { LanModel } from "../../../models/lan";

export const getList: RequestHandler = async (req, res) => {
  const allLans = (await LanModel.find().sort({ _id: -1 }).limit(5).exec()).map(lan => lan.toObject());

  res.render('lan/list', {
    user: req.user,
    lans: allLans,
    title: "Alle LAN"
  });
}