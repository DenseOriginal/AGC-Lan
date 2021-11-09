import { RequestHandler } from "express";
import { LanModel } from "../../models/lan";

export const getList: RequestHandler = async (req, res) => {
  // Get all lan sorted by their order
  // The newest lan will be first, and the oldest lan will be last
  const allLans = (await LanModel.find().sort({ _id: -1 }).limit(5).exec()).map(lan => lan.toObject());

  const upcomingLans = allLans.filter(lan => lan.end.getTime() > Date.now());
  const previousLans = allLans.filter(lan => lan.end.getTime() < Date.now());


  // If the first lan hasn't enden, remove it from the allLans array and store it in currentLan
  // Otherwise don't do anytihing
  const nextLan = upcomingLans[0] && upcomingLans[0].end.getTime() > Date.now() ? upcomingLans.shift() : undefined;
  const nextLanHeader = nextLan && nextLan.start.getTime() < Date.now() && nextLan.end.getTime() > Date.now() ? 'Nuværende' : 'Næste';

  res.render('lan/list', {
    user: req.user,
    upcomingLans,
    previousLans,
    nextLan,
    nextLanHeader,
    noLan: previousLans.length == 0 && !nextLan, // Avoid using logic in template
    title: "Alle LAN"
  });
}