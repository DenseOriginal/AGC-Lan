import { Router } from "express";
import { getLan } from "./_id";

export const LanRouter = Router();

LanRouter.route('/:lanId').get(getLan);