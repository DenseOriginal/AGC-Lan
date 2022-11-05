import { Router } from "express";
import { getConstruction } from "../construction";
import { getTournamentList } from "./list";

export const TournamentsRouter = Router();

// If we're not in development, serve a under construction for all requests
// To /turneringer
// TODO: Fix /turneringer route, and remove this
if (process.env.NODE_ENV !== "development") TournamentsRouter.route('**').get(getConstruction);

TournamentsRouter.route("/").get(getTournamentList);