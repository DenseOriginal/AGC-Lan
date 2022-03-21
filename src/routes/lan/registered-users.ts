import { RequestHandler } from "express";
import { LanUserModel } from "../../models/lan-user";
import { IUser } from "../../models/user";

export const getRegisteredUsers: RequestHandler = async (req, res) => {
  const lanId: string = req.params.lanId;
  
  // Set the neccesary headers
  res.header('Content-Type', 'text/csv');
  res.attachment(`tilmeldte-${lanId}.csv`);

  const registeredUsers = await LanUserModel.find({ lan: lanId }).populate('user').exec();
  const csvHeaders = 'id,user_id,name,username,seat,registered_at';
  const csvData = registeredUsers.map(doc => doc.toObject())
    .map(user => `${user._id},${(user.user as IUser)._id},${(user.user as IUser).first_name + ' ' + (user.user as IUser).last_name},${(user.user as IUser).username},${user.seat},${user.registered_at}`);
  
  return res.send(
    csvHeaders + '\n' +
    csvData.join('\n')
  );
}