import { Router } from "express";
import { RequestHandler } from "express-serve-static-core";
import { isValidObjectId } from "mongoose";
import { isNotBanned } from "../../config/guards";
import { isAuthenticated } from "../../config/guards";
import { isStaff } from "../../config/passport";
import { LanModel } from "../../models/lan";
import { getCreate, postCreate } from "./create";
import { getList } from "./list";
import { getTilmeld, postTilmeld } from "./tilmeld";
import { getLan } from "./_id";

export const LanRouter = Router();

LanRouter.route('/list').get(getList);

// TODO: remove this
// LanRouter.route('/create').get(isSuperAdmin, getCreate);
// LanRouter.route('/create').post(isSuperAdmin, postCreate);

// This need to be last to not catch all the other routes
LanRouter.route('/:lanId').get(findLan('lanId'), getLan);
LanRouter.route('/:lanId/tilmeld').get(isAuthenticated, isNotBanned, findLan('lanId'), getTilmeld);
LanRouter.route('/:lanId/tilmeld').post(isAuthenticated, isNotBanned, findLan('lanId'), postTilmeld);

// Helper middleware
function findLan(paramId: string): RequestHandler {
  return async (req, res, next) => {
    // Take a string, and uses it to find the lan id stored in the req.params
    // This is done so that if we have another with some other paramId for the lan id
    // We can simply change it
    const lanId = req.params[paramId];
  
    // If the id isn't a valid mongoDB ObjectID then it can't be a valid user
    if(!isValidObjectId(lanId)) return res.render("error", {
      user: req.user,
      title: 'No lan',
      header: 'Dette Lan findes ikke',
      error: 'Du prøver at finde at id som ikke findes',
    });
  
    try {
      // Try to find a lan with matching id, the convert it to an object to get rid of mongoose model stuff
      const foundLan = (await LanModel.findOne({ _id: lanId }).exec());
  
      // If no lan was found
      // or if the lan isn't public and the user isn't a staff
      // Then tell the user that the lan doesn't exist
      if((!foundLan) || (!foundLan.public && !isStaff(req.user))) return res.render("error", {
        user: req.user,
        title: 'No lan',
        header: 'Dette Lan findes ikke',
        error: 'Du prøver at finde at id som ikke findes',
      });
  
      // Inject the lan into the request
      // And call the next function to continue the execution
      (req as any).lan = foundLan;
      next();
    } catch(err) {
      console.error(err);
      return res.render("error", {
        user: req.user,
        title: 'No lan',
        header: '500',
        error: 'Der er sket en fejl, prøv igen senere',
      });
    }
  }
}