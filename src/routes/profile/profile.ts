import { randomBytes } from "crypto";
import { RequestHandler } from "express";
import { LanUserModel } from "../../models/lan-user";
import { UserModel } from "../../models/user";
import { isValidClass } from "./setup";

export const getProfile: RequestHandler = async (req, res) => {
  // Generate a csrf token, which is just a random string
  // This is used to make sure that it's the user that wanted to delete their account
  // And that they weren't tricked somehow
  const csrfToken = randomBytes(64).toString('hex');

  // Save the token in the session
  (req as any).session['csrf_token'] = csrfToken;

  // Get the users tilmeldinger
  // Also get the lan that those tilmeldinger contain
  const tilmeldinger = await LanUserModel.find({
    user: req.user?._id
  }).sort({ _id: -1 }).limit(10).populate('lan').exec();

  // Send something to the user
  res.status(200).render('profile/profile', {
    user: req.user,
    title: "Profile",
    tilmeldinger: tilmeldinger.map(cur => cur.toObject()),
    csrfToken
  });
};

export const postProfile: RequestHandler = async (req, res) => {
  // Get the posted date from the client
  const { first_name, last_name, class: klasse, username } = req.body as { [index: string]: string | undefined };

  // The only data we really need to validate it the class, to make sure it fits the correct way of writing
  // because the others are just strings, that are free
  // Therefore we can just do one if statement
  // And if the failes, just do a silent error (This is bad)
  // TODO: Better errorhandling
  if(isValidClass((klasse || "").toUpperCase())) {
    try {
      const newUser = await UserModel.findByIdAndUpdate(req.user?._id, {
        first_name: first_name,
        last_name: last_name,
        class: klasse,
        username: username,
      }).exec();

      req.user = newUser?.toObject();
    } catch (error) {
      return res.render('error', { error: 'Der er sket en uventet fejl' });
    }
  }

  return res.redirect('/profile');
}