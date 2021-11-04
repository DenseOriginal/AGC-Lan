import { RequestHandler } from "express";
import { UserModel } from "../../models/user";

// Route to give staff priviliges
// This is protected by isAdmin guard
export const postAddStaff: RequestHandler = async (req, res) => {
  // Get the user id from the req.body
  const id = req.body.id; 
  
  try {
    // Update the user
    await UserModel.updateOne({ _id: id }, {
      is_staff: true,
    });

    // If the upadte succeeded then send status 204 (No content) and end
    res.status(204).end();
  } catch (error) {

    // TODO: Implement better error handling
    // If an error happens, log it, and send status 500 (Internal server error)
    console.log(error);
    res.status(500).end();
  }
}

// Route to remove staff priviliges
// This is protected by isAdmin guard
export const postRemoveStaff: RequestHandler = async (req, res) => {
  // Get the user id from the req.body
  const id = req.body.id; 
  
  try {
    // Update the user
    await UserModel.updateOne({ _id: id }, {
      is_staff: false,
    });

    // If the upadte succeeded then send status 204 (No content) and end
    res.status(204).end();
  } catch (error) {

    // TODO: Implement better error handling
    // If an error happens, log it, and send status 500 (Internal server error)
    console.log(error);
    res.status(500).end();
  }
}