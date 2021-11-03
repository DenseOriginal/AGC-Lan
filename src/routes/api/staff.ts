import { RequestHandler } from "express";
import { UserModel } from "../../models/user";

export const postAddStaff: RequestHandler = async (req, res) => {
  const id = req.body.id; 
  
  try {
    await UserModel.updateOne({ _id: id }, {
      is_staff: true,
    });

    res.status(204).end();
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
}

export const postRemoveStaff: RequestHandler = async (req, res) => {
  const id = req.body.id; 
  
  try {
    await UserModel.updateOne({ _id: id }, {
      is_staff: false,
    });

    res.status(204).end();
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
}