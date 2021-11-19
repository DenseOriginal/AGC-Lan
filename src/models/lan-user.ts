import { Model, model, Schema, Document } from "mongoose";
import { ILAN } from "./lan";
import { IUser } from "./user";

export interface ILANUser {
  user: IUser | string;
  lan: ILAN | string;
  seat: string;
  registered_at: Date;
}

export type LANUserAsDocument = ILANUser & Document;

const LanUser = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'Users' },
  lan: { type: Schema.Types.ObjectId, ref: 'Lans' },
  seat: { type: String, required: true },
  registered_at: { type: Date, default: new Date() }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - victuals
 */
 LanUser.pre('save', async function(this: LANUserAsDocument, next) {
 });

 /**
  * Methods
  */
 LanUser.method({});
 
 /**
  * Statics
  */
 LanUser.statics = {};
 
 export const LanUserModel: Model<ILANUser> = model('LanUser', LanUser);