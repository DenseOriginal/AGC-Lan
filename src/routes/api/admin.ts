import { RequestHandler } from "express";
import { UserModel } from "../../models/user";

export const postAddAdmin: RequestHandler = async (req, res) => {
  const id = req.body.id; 
  
  try {
    await UserModel.updateOne({ _id: id }, {
      is_staff: true,
      is_admin: true,
    });

    res.status(204).end();
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
}

export const postRemoveAdmin: RequestHandler = async (req, res) => {
  const id = req.body.id; 
  
  try {
    await UserModel.updateOne({ _id: id }, {
      is_admin: false,
    });

    res.status(204).end();
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
}