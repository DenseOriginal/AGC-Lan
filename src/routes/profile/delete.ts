import { RequestHandler } from "express";
import { UserModel } from "../../models/user";

export const getDelete: RequestHandler = async (req, res) => {
  if(
    // The csrf token is set in the profile handler, and now we need to check if the match
    req.body._csrf != (req as any).session['csrf_token'] ||
    // This is pretty much unneccesray but we use it as another security check
    req.body.check_token != req.user?.email

    // If the checks fails, the form is tampered with
  ) return res.status(403).send('Form tampered with')

  try {
    // Try to delete the acoount
    await UserModel.findByIdAndDelete(req.user?._id);

    // If the account was succesfully deleted, then logout the user
    // To remove the session
    req.logout(() => {
      // Notify the user
      return res.send('Account deleted');
    });

  } catch (error) {
    // If an error happened, log the error
    console.error(error);

    // And notify the user, that their account wasn't deleted
    return res.status(500).send('Der er sket en fejl, din bruger er ikke blevet slettet');
  }
}