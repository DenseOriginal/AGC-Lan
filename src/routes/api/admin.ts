import { RequestHandler } from "express";
import { UserModel } from "../../models/user";

// Route to give a user admin privileges
// This route is being guarded by isSuperAdmin guard
export const postAddAdmin: RequestHandler = async (req, res) => {
  // Get the the user id from the request body
  const id = req.body.id; 
  
  try {
    // Update the found user
    // Make sure to also set is_staff to true.
    await UserModel.updateOne({ _id: id }, {
      is_staff: true,
      is_admin: true,
    });

    // Send status 204 (No content) and end
    res.status(204).end();
  } catch (error) {

    // TODO: Implement better error handling
    // If an error happens log it to the console, and send status 500 (Internal server error)
    console.log(error);
    res.status(500).end();
  }
}

// Route to remove a users admin privileges
// This route is being guarded by isSuperAdmin guard
export const postRemoveAdmin: RequestHandler = async (req, res) => {
  // Get the the user id from the request body
  const id = req.body.id; 
  
  try {
    // Update the found user
    // We don't need to remove is_staff privilegies
    await UserModel.updateOne({ _id: id }, {
      is_admin: false,
    });

    // Send status 204 (No content) and end
    res.status(204).end();
  } catch (error) {

    // TODO: Implement better error handling
    // If an error happens log it to the console, and send status 500 (Internal server error)
    console.log(error);
    res.status(500).end();
  }
}