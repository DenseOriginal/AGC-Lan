import { Request, RequestHandler, Response } from "express";
import { isValidObjectId } from "mongoose";
import { isStaff } from "../../config/passport";
import { ILAN, LANAsDocument, LanModel } from "../../models/lan";
import { ILANUser, LanUserModel } from "../../models/lan-user";
import { IUser } from "../../models/user";
import { getShowTilmelding } from "./_tilmelding";

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

    const takenSeatsRaw = await LanUserModel.find({ lan: foundLan._id }).populate('user').exec();
    const takenSeats = takenSeatsRaw.map((document) => document.toObject())
      .map(tilmelding => ({
        seat: tilmelding.seat,
        name: (tilmelding.user as IUser).first_name + ' ' + (tilmelding.user as IUser).last_name,
        discord: (tilmelding.user as IUser).username,
      }));

    // Otherwise if nothing failed then render the lan to the user
    return res.render("lan/tilmeld", {
      user: req.user,
      title: foundLan.name,
      lan: foundLan.toObject(),
      tables: rangesToTables(foundLan.seats),
      tilmelding: undefined,
      takenSeats: JSON.stringify(takenSeats),
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
    // We also need to get the occupied seats, this is to that we can check if a seat is already taken
    const foundLan = await ((req as any).lan as LANAsDocument).populate('users');
    const users = foundLan.users as ILANUser[];

    // Perfom check to see if lan is valid
    await validateLan(foundLan || undefined, req, res);
    // If this is true, a response was sent by the validate function, so we can't do anymore
    if(res.headersSent) return;

    // Check if the seat is already reserved
    // We can check this, by seeing if any element in the array has the same seat as the seat sent from th client
    // But users can also update their tilmelding withour updating their seat
    // So we need to make sure that any already reserver seat, is reserved by someone other than the current user
    // We also need to check that the seat isn't "none", because multiple users should be allowed to not have a seat
    if(users.find(cur => (cur.seat == seat && cur.seat != 'none' && cur.user != req.user?._id.toString()))) return res.render("lan/tilmeld", {
      user: req.user,
      title: 'Fejl',
      error: 'Dette sæde er allerede reserveret'
    });

    if(prevTilmeldingID && !isValidObjectId(prevTilmeldingID)) throw new Error('Previuos Tilmelding ID is not a valid key');
    // If a prevTelmeldinID is set, get that
    // Otherwise try to find one already registered by the user
    const prevTilmelding = prevTilmeldingID ? 
      await LanUserModel.findById(prevTilmeldingID).exec() :
      await LanUserModel.findOne({ user: req.user?._id, lan: lanId }).exec();
  
    // If prevTilmeldingID is true but we didn't find any tilmelding
    // Something is proparly wrong, and it most likely means the user changed the hidden id field
    if(prevTilmeldingID && !prevTilmelding) throw new Error('Couldn\'t find any tilmelding matching provided ID');

    if(prevTilmelding) {
      if(prevTilmelding.user.toString() != req.user?._id.toString()) throw new Error('Tilmelding user doesn\'t match the logged in user!');

      await prevTilmelding.updateOne({ seat }).exec();

      return res.redirect(`/lan/tilmelding/${prevTilmelding.id}?type=update`);
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

    return res.redirect(`/lan/tilmelding/${newLanUser.id}?type=new`);
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
export function rangesToTables(ranges: string[]): { [idx: string]: string[] } {
  const tables: { [idx: string]: string[] } = { };

  ranges.forEach(range => {
    const [table, start, end] = range.match(/(^[a-zA-Z]{1,3})|\d+/g) || ["?", "0", "1"];
    const seats = Array.from({ length: (+end - +start) }, (_, idx) => table + (+start + idx + 1));
    !!tables[table] ? tables[table].push(...seats) : tables[table] = seats;
  });

  return tables;
}