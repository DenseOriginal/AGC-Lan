import { Model, model, Schema, Document } from "mongoose";
import type { ILAN } from "./lan";
import type { IUser } from "./user";

export interface ILANUser {
  user: IUser | string;
  lan: ILAN | string;
  seat: string;
  registered_at: Date;
  has_paid: boolean;
  payment_validator: IUser | string;
}

export type LANUserAsDocument = ILANUser & Document;

const LanUser = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'Users' },
  lan: { type: Schema.Types.ObjectId, ref: 'Lans' },
  seat: { type: String, required: true },
  registered_at: { type: Date, default: new Date() },
  has_paid: { type: Boolean, default: false },
  payment_validator: { type: Schema.Types.ObjectId, ref: 'Users', default: undefined },
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
 
 export const LanUserModel: Model<ILANUser> = model<ILANUser>('LanUser', LanUser);