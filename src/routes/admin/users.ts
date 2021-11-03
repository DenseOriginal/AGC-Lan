import { RequestHandler } from "express";
import { stringify } from "qs";
import { UserModel } from "../../models/user";

const sortCategories = ['first_name', 'last_name', 'username', 'email', 'class'];

export const getUsers: RequestHandler = async (req, res) => {
  // Raw url query
  const rawSort = req.query.sort;

  // Make sure rawSort is both a string and a valid sortCategory
  const sortBy = (typeof rawSort == 'string' && sortCategories.includes(rawSort)) ? rawSort : 'first_name';
  
  // Get all users sort them by sortBy and limit the request
  // OBS: THIS DOES NOT INCLUDE PARTIAL USERS
  const usersReq = await UserModel.find().sort(sortBy).limit(100).exec();

  // Map all the users to just the object instead of the mongoose model
  const users = usersReq.map(user => user.toObject());

  // Change the _id propetry to a string, instead of mongoose's wierd type
  users.forEach(user => user._id = user._id.toString());

  // Render the users views
  return res.render('users', {
    title: 'Users',
    user: req.user,
    users,
  });
}