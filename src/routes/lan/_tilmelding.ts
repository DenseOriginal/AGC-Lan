import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import { ILAN } from "../../models/lan";
import { ILANUser, LanUserModel } from "../../models/lan-user";

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

    return res.render("lan/tilmeld", {
      user: req.user,
      title: foundLan.name,
      lan: foundLan,
      tables: rangesToTables(foundLan.seats),
      tilmelding: tilmelding.toObject(),
      // Map the tilmeldt users down to an array of just the seats, because we don't need the rest
      takenSeats: typeof foundLan.users == "string" ? [] : foundLan.users.map(user => (user as ILANUser).seat),
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

// Explenation in seats.md
function rangesToTables(ranges: string[]): { [idx: string]: string[] } {
  const tables: { [idx: string]: string[] } = { };

  ranges.forEach(range => {
    const [table, start, end] = range.match(/(^[a-zA-Z]{1,3})|\d+/g) || ["?", "0", "1"];
    const seats = Array.from({ length: (+end - +start) }, (_, idx) => table + (+start + idx + 1));
    !!tables[table] ? tables[table].push(...seats) : tables[table] = seats;
  });

  return tables;
}