import { Request, RequestHandler, Response } from "express";
import { isValidObjectId } from "mongoose";
import { isStaff } from "../../config/passport";
import { ILAN, LANAsDocument, LanModel } from "../../models/lan";
import { ILANUser, LanUserModel } from "../../models/lan-user";

export const getTilmeld: RequestHandler = async (req, res) => {
  const lanId = req.params.lanId;

  try {
    // Try to find a lan with matching id, the convert it to an object to get rid of mongoose model stuff
    const foundLan = await ((req as any).lan as LANAsDocument)
      .populate("users", "seat");

    // Perfom check to see if lan is valid
    await validateLan(foundLan, req, res);
    // If this is true, a response was sent by the validate function, so we can't do anymore
    if(res.headersSent) return;

    // Check if the user is already registered
    const tilmelding = await LanUserModel.findOne({
      user: req.user?._id,
      lan: foundLan._id,
    }).exec();

    if(tilmelding) return res.redirect(`/lan/tilmelding/${tilmelding._id}`);

    // Otherwise if nothing failed then render the lan to the user
    return res.render("lan/tilmeld", {
      user: req.user,
      title: foundLan.name,
      lan: foundLan.toObject(),
      tables: rangesToTables(foundLan.seats),
      tilmelding: undefined,
      takenSeats: typeof foundLan.users == "string" ? [] : foundLan.users.map(user => (user as ILANUser).seat),
    })

  } catch (error) {
    // If an error happened log it, and tell the user
    console.error(error);
    return res.render('lan/tilmeld', {
      title: 'Error',
      user: req.user,
      error: "Der er sket en uventet fejl, prøv igen senere"
    });
  }
}

export const postTilmeld: RequestHandler = async (req, res) => {
  const seat: string = req.body.seat || 'none';
  const prevTilmeldingID: string | undefined = req.body.tilmeldingID;

  const lanId = req.params.lanId;

  // We can be sure that the user isn't undefined, because we have a guard in place on this route
  // That makes sure the user is logged in, and if that passes, the user must be a user
  // Therefore we can set the userId as a string
  const userId = req.user?._id as string;

  try {
    // Fetch the lan to check if we can register

    // Try to find a lan with matching id, the convert it to an object to get rid of mongoose model stuff
    const foundLan = ((req as any).lan as LANAsDocument);

    // Perfom check to see if lan is valid
    await validateLan(foundLan || undefined, req, res);
    // If this is true, a response was sent by the validate function, so we can't do anymore
    if(res.headersSent) return;

    if(prevTilmeldingID) {
      if(!isValidObjectId(prevTilmeldingID)) throw new Error('Previuos Tilmelding ID is not a valid key');

      await LanUserModel.updateOne({ _id: prevTilmeldingID }, { seat }).exec();
      return res.render("lan/tilmeld", {
        user: req.user,
        title: 'Opdateret',
        message: 'Din tilmelding er blevet opdateret',
        lan: foundLan?.toObject(), // Convert it to an object because mongoose fuckery
      });
    }

    const newLanUser = new LanUserModel({
      user: userId,
      lan: lanId,
      seat,
    });

    await newLanUser.save();
    await foundLan?.updateOne({
      $push: { users: newLanUser._id }
    }).exec();

    // If everything worked out, tell the user
    return res.render("lan/tilmeld", {
      user: req.user,
      title: 'Tilmeldt',
      message: 'Tillykke du er nu tilmeldt LAN',
      lan: foundLan?.toObject(), // Convert it to an object because mongoose fuckery
    });
  } catch (error) {
    console.error(error);
    return res.render("lan/tilmeld", {
      user: req.user,
      title: 'Error',
      error: 'Der er sket en fejl, prøv igen senere'
    });
  }
}

function validateLan(foundLan: ILAN | LANAsDocument | undefined, req: Request, res: Response) {
  // We need to return a promise this way, because otherwise shit doesn't work
  return new Promise<void>(async (resolve) => {
    // If no lan was found
    // or if the lan isn't public and the user isn't a staff
    // Then tell the user that the lan doesn't exist
    if((!foundLan) || (!foundLan.public && !isStaff(req.user))) return res.render("lan/tilmeld", {
      user: req.user,
      title: 'No lan',
      error: 'Dette LAN findes ikke'
    });

    // If the lan isn't open for registration
    if(!foundLan.registration_open) return res.render("lan/tilmeld", {
      user: req.user,
      title: foundLan.name,
      error: 'Dette LAN er ikke åben for tilmeldingener endnu, prøv igen senere'
    });

    // If the LAN has ended you can't register for it... dumbass
    // So instead of giving a reason, just redirect to 404, because we can
    if(foundLan.end < new Date()) return res.render("404", {
      user: req.user,
      title: '404',
      noHeader: true
    });

    resolve();
  });
}

// Explenation in seats.md
function rangesToTables(ranges: string[]): { [idx: string]: string[] } {
  const tables: { [idx: string]: string[] } = { };

  ranges.forEach(range => {
    const [table, start, end] = range.match(/(^.{1})|\d+/g) || ["?", "0", "1"];
    const seats = Array.from({ length: (+end - +start) }, (_, idx) => table + (+start + idx + 1));
    !!tables[table] ? tables[table].push(...seats) : tables[table] = seats;
  });

  return tables;
}