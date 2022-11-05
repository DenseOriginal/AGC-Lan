import { RequestHandler } from "express";
import { TournamentModel } from "../../models/tournament";

export const getTournamentList: RequestHandler = async (req, res) => {
  const tournaments = await TournamentModel.find({
    start: { $gt: new Date() },
    public: true
  });

  res.render('tournament/list', {
    tournaments: tournaments.map(t => t.toObject()),
    title: 'Turneringer'
  });
}