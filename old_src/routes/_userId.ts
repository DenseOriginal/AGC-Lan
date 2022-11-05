import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import { UserModel } from "../models/user";

export const getUser: RequestHandler = async (req, res) => {
  // Retrieve the id from the url /user/:id
  const id = req.params.id;

  // If the user is trying to view themself, redirect them to /profile
  if(id == req.user?._id) return res.redirect("/profile");

  // If the id isn't a valid mongoDB ObjectID then it can't be a valid user
  if(!isValidObjectId(id)) return res.render("_userId", {
    user: req.user,
    title: 'No user',
    error: 'Denne bruger findes ikke'
  })

  try {
    // Try to find a user, and convert the user into a object to get rid of mongoose model stuff
    const foundUser = (await UserModel.findOne({ _id: id }).exec())?.toObject();

    if(!foundUser) {
      // If we didn't find a user, the tell the user that
      return res.render('_userId', {
        user: req.user,
        error: "Ingen bruger fundet"
      });
    }

    // Render the _userId page and pass the foundUser to handlebars
    return res.render('_userId', {
      title: foundUser?.username,
      foundUser,
      user: req.user,
    });
  } catch (error) {
    // If an error happened log it, and tell the user
    console.error(error);
    return res.render('_userId', {
      title: 'Error',
      user: req.user,
      error: "Der er sket en fejl, prøv igen senere"
    });
  }

}