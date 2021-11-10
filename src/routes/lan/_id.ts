import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import { isStaff } from "../../config/passport";
import { LanModel } from "../../models/lan";

export const getLan: RequestHandler = async (req, res) => {
  const lanId = req.params.lanId;

  // If the id isn't a valid mongoDB ObjectID then it can't be a valid user
  if(!isValidObjectId(lanId)) return res.render("lan/_id", {
    user: req.user,
    title: 'No lan',
    error: 'Dette LAN findes ikke'
  });

  try {
    // Try to find a lan with matching id, the convert it to an object to get rid of mongoose model stuff
    const foundLan = (await LanModel.findOne({ _id: lanId }).exec())?.toObject();

    // If no lan was found
    // or if the lan isn't public and the user isn't a staff
    // Then tell the user that the lan doesn't exist
    if((!foundLan) || (!foundLan.public && !isStaff(req.user))) return res.render("lan/_id", {
      user: req.user,
      title: 'No lan',
      error: 'Dette LAN findes ikke'
    });

    // Otherwise if nothing failed then render the lan to the user
    return res.render("lan/_id", {
      user: req.user,
      title: foundLan.name,
      lan: foundLan
    })

  } catch (error) {
    // If an error happened log it, and tell the user
    console.error(error);
    return res.render('lan/_id', {
      title: 'Error',
      user: req.user,
      error: "Der er sket en uventet fejl, prøv igen senere"
    });
  }
}