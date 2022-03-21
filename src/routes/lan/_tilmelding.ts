import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import { ILAN } from "../../models/lan";
import { ILANUser, LanUserModel } from "../../models/lan-user";
import { IUser } from "../../models/user";
import { rangesToTables } from "./tilmeld";

export const getShowTilmelding: RequestHandler = async (req, res) => {
  const tilmeldingId = req.params.tilmeldingId;

  // If the id isn't a valid mongoDB ObjectID then it can't be a valid user
  if(!isValidObjectId(tilmeldingId)) return res.render("error", {
    user: req.user,
    title: '404',
    error: 'Der er sket en uventet fejl, prøv igen senere',
  });

  try {
    // When we try to find the tilmelding
    // Populate the lan field
    // And the deep populate users on the lan property
    const tilmelding = await LanUserModel.findById(tilmeldingId).populate({
      path: 'lan',
      populate: { path: 'users' }
    }).exec();
    

    // If we can't find any tilmeling, then throw an error
    // Or the lan doesn't exist
    // Or the userId doesn't match the logged in user's id
    // Which wil result in the catch rendering an error to the user 
    if(!tilmelding) throw new Error('Tilmeldning doesn\'t exist');
    if(tilmelding.user.toString() != req.user?._id) throw new Error('The logged in user doesn\'t own this tilmelding');
    if(typeof tilmelding.lan == "string") throw new Error('Tilmelding for invalid lan');

    // We need to convert it an object before we acces lan, because otherwise
    // Handlebars will deny acces to acces any properties on it
    const foundLan = tilmelding.toObject().lan as ILAN;

    if(req.query.type == "update") res.sendMessage('info', 'Din tilmelding er blevet opdateret');
    if(req.query.type == "new") res.sendMessage('info', 'Tillykke du er nu tilmeldt LAN');

    const takenSeatsRaw = await LanUserModel.find({ lan: foundLan._id }).populate('user').exec();
    const takenSeats = takenSeatsRaw.map((document) => document.toObject())
      .map(tilmelding => ({
        seat: tilmelding.seat,
        name: (tilmelding.user as IUser).first_name + ' ' + (tilmelding.user as IUser).last_name,
        discord: (tilmelding.user as IUser).username,
      }));

    return res.render("lan/tilmeld", {
      user: req.user,
      title: foundLan.name,
      lan: foundLan,
      tables: rangesToTables(foundLan.seats),
      tilmelding: tilmelding.toObject(),
      // Map the tilmeldt users down to an array of just the seats, because we don't need the rest
      takenSeats: JSON.stringify(takenSeats),
    })
  } catch (error) {
    console.error(error);
    return res.render('error', {
      title: 'Error',
      user: req.user,
      error: "Der er sket en uventet fejl, prøv igen senere"
    });
  }
}
