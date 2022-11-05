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

export const setLanUserPaidStatus: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id as string;
    const { hasPaid } = req.body;    
    
    await LanUserModel.findByIdAndUpdate(id, {
      has_paid: hasPaid,
      payment_validator: userId,
    }).exec();
  
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: 'Something went wrong' });
  }
}