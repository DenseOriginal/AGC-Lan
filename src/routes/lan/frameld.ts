import { Request, RequestHandler, Response } from "express";
import { ObjectId } from "mongoose";
import { ILAN, LANAsDocument, LanModel } from "../../models/lan";
import { LanUserModel } from "../../models/lan-user";

export const getFrameld: RequestHandler = async (req, res) => {
  const foundLan = ((req as any).lan as LANAsDocument).toObject<ILAN>();

  // Perfom check to see if lan is valid
  await validateLan(foundLan, req, res);
  // If this is true, a response was sent by the validate function, so we can't do anymore
  if(res.headersSent) return;

  // Otherwise if nothing failed then render the lan to the user
  return res.render("lan/frameld", {
    user: req.user,
    title: 'Frameld ' + (foundLan as ILAN).name, // If we the execution came this far, that must mean foundLan is not undefined
    lan: foundLan
  });
}

export const postFrameld: RequestHandler = async (req, res) => {
  const foundLan = ((req as any).lan as LANAsDocument);

  try {
    // Perfom check to see if lan is valid
    await validateLan(foundLan, req, res);
    // If this is true, a response was sent by the validate function, so we can't do anymore
    if(res.headersSent) return;
  
    // Save this to that we can use the id to remove it from the lan users
    const deltedLanUser = await LanUserModel.findOneAndDelete({
      lan: foundLan._id,
      user: req.user?._id
    }).exec();
    
    // Now use the deletedLanUser's id to remove it from the lan users array
    await foundLan.updateOne({
      // The _id is any, but if we set it to type ObjectIf or type string, everything breaks
      // Mongooooooose is fucking wierd, i have zero idea why, but this works so fuck you
      $pull: { users: (deltedLanUser?._id) }
    });

    // Otherwise if nothing failed then tell the user
    return res.render("lan/frameld", {
      user: req.user,
      title: 'Frameld ' + (foundLan as ILAN).name, // If the execution came this far, that must mean foundLan is not undefined
      lan: foundLan,
      message: 'Du er nu blevet frameldt fra LAN'
    });
  } catch (error) {
    console.error(error);
    return res.render("error", {
      user: req.user,
      title: 'Earth',
      header: '500',
      error: 'Der er sket en fejl, prøv igen senere',
    });
  }
}

// Helpers

// Validate than the lan actually exist, and that the user is registered
function validateLan(foundLan: ILAN | LANAsDocument | undefined, req: Request, res: Response) {
  // We need to return a promise this way, because otherwise shit doesn't work
  return new Promise<void>(async (resolve) => {
    // If no lan was found
    // Then tell the user that the lan doesn't exist
    if(!foundLan) return res.render("error", {
      user: req.user,
      title: 'No lan',
      header: "404",
      error: 'Dette LAN findes ikke'
    });


    // If the LAN has ended you can't unregister from it... dumbass
    // So instead of giving a reason, just redirect to 404, because we can
    if(foundLan.end < new Date()) return res.render("404", {
      user: req.user,
      title: '404',
      noHeader: true
    });

    // Make sure the user is already registered
    // If the user isn't, then give them an error
    const lanUser = await LanUserModel.findOne({
      user: req.user?._id,
      lan: foundLan._id,
    }).exec();

    if(!lanUser) return res.render("error", {
      user: req.user,
      title: foundLan.name,
      error: 'Du er ikke tilmeldt til dette lan, så du kan ikke framelde dig selv'
    });
    
    resolve();
  });
}