import { Router } from "express";
import { getTournamentList } from "./list";

export const TournamentsRouter = Router();

TournamentsRouter.route("/").get(getTournamentList);