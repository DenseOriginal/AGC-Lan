import { Router } from "express";
import { RequestHandler } from "express-serve-static-core";
import { isValidObjectId } from "mongoose";
import { isNotBanned, requestGuardIsAdmin } from "../../config/guards";
import { isAuthenticated } from "../../config/guards";
import { isAdmin, isStaff } from "../../config/passport";
import { LanModel } from "../../models/lan";
import { getFrameld, postFrameld } from "./frameld";
import { getList } from "./list";
import { redirectToCurrentFrameld, redirectToCurrentTilmeld } from "./redirect";
import { getRegisteredUsers, getRegisteredUsersRaw } from "./registered-users";
import { getTilmeld, postTilmeld } from "./tilmeld";
import { getLan } from "./_id";
import { getShowTilmelding } from "./_tilmelding";

export const LanRouter = Router();

LanRouter.route('/list').get(getList);
LanRouter.route('/tilmeld').get(redirectToCurrentTilmeld);
LanRouter.route('/frameld').get(redirectToCurrentFrameld);
LanRouter.route('/tilmelding/:tilmeldingId').get(isAuthenticated, getShowTilmelding);

// This need to be last to not catch all the other routes
LanRouter.route('/:lanId').get(findLan('lanId'), getLan);
LanRouter.route('/:lanId/tilmeld').get(isAuthenticated, isNotBanned, findLan('lanId'), getTilmeld);
LanRouter.route('/:lanId/tilmeld').post(isAuthenticated, isNotBanned, findLan('lanId'), postTilmeld);

LanRouter.route('/:lanId/frameld').get(isAuthenticated, isNotBanned, findLan('lanId'), getFrameld);
LanRouter.route('/:lanId/frameld').post(isAuthenticated, isNotBanned, findLan('lanId'), postFrameld);

LanRouter.route('/:lanId/get-users').get(requestGuardIsAdmin, findLan('lanId'), getRegisteredUsers);
LanRouter.route('/:lanId/get-users.csv').get(requestGuardIsAdmin, getRegisteredUsersRaw);

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