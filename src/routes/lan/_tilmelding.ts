import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import { LanUserModel } from "../../models/lan-user";

export const getShowTilmelding: RequestHandler = async (req, res) => {
  const tilmeldingId = req.params.tilmeldingId;

  // If the id isn't a valid mongoDB ObjectID then it can't be a valid user
  if(!isValidObjectId(tilmeldingId)) return res.render("error", {
    user: req.user,
    title: '404',
    error: 'Der er sket en uventet fejl, prøv igen senere',
  });

  try {
    const tilmelding = await LanUserModel.findById(tilmeldingId).populate('lan').exec();

    // If we can't find any tilmeling, then throw an error
    // Or the lan doesn't exist
    // Or the userId doesn't match the logged in user's id
    // Which wil result in the catch rendering an error to the user 
    if(!tilmelding) throw new Error('Tilmeldning doesn\'t exist');
    if(tilmelding.user.toString() != req.user?._id) throw new Error('The logged in user doesn\'t own this tilmelding');
    if(typeof tilmelding.lan == "string") throw new Error('Tilmelding for invalid lan');

    return res.render('lan/_tilmelding', {
      title: 'Tilmelding',
      user: req.user,
      tilmelding: tilmelding.toObject()
    });
  } catch (error) {
    console.error(error);
    return res.render('error', {
      title: 'Error',
      user: req.user,
      error: "Der er sket en uventet fejl, prøv igen senere"
    });
  }
}