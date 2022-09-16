import { RequestHandler } from "express";
import { LanUserModel } from "../../models/lan-user";

export const getLanUser: RequestHandler = async (req, res) => {
  const lanUser = await LanUserModel.findById(req.params.id)
    .populate('user', 'first_name username class')
    .populate('lan', 'name price')
    .exec();

  if (!lanUser) return res.status(404).send({ error: 'LanUser not found' });
  
  return res.json(lanUser);
  
}