import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import { UserModel } from "../models/user";

export const getUser: RequestHandler = async (req, res) => {
  // Retrieve the id from the url /user/:id
  const id = req.params.id;

  // If the user is trying to view themself, redirect them to /profile
  if(id == req.user?._id) return res.redirect("/profile");

  // If the id isn't a valid mongoDB ObjectID then it can't be a valid user
  if(!isValidObjectId(id)) return res.render("find-user", {
    user: req.user,
    title: 'No user',
    error: 'Denne bruger findes ikke'
  })

  try {
    const foundUser = (await UserModel.findOne({ _id: id }).exec())?.toObject();

    if(!foundUser) {
      return res.render('find-user', {
        user: req.user,
        error: "Ingen bruger fundet"
      });
    }

    return res.render('find-user', {
      title: foundUser?.username,
      foundUser,
      user: req.user,
    });
  } catch (error) {
    console.error(error);
    return res.render('find-user', {
      title: 'Error',
      user: req.user,
      error: "Der er sket en fejl, prøv igen senere"
    });
  }

}