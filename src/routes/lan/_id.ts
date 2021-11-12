import { RequestHandler } from "express";
import { LANAsDocument } from "../../models/lan";
import { LanUserModel } from "../../models/lan-user";

export const getLan: RequestHandler = async (req, res) => {
  try {
    // Extract the lan from the request, as this route has some special middleware
    // More in ./router.ts
    const foundLan = ((req as any).lan as LANAsDocument).toObject();

    // Fetch to see if a user is tilmeldt to the lan
    const lanUser = await LanUserModel.findOne({
      lan: foundLan._id,
      user: req.user?._id
    }).exec();

    // Otherwise if nothing failed then render the lan to the user
    return res.render("lan/_id", {
      user: req.user,
      title: foundLan.name,
      lan: foundLan,
      tilmelding: lanUser?.toObject(),
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