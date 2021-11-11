import { Model, model, Schema } from "mongoose";
import { IUser } from "./user";

export interface ILAN {
  name: string;
  description: string;
  start: Date;
  end: Date;
  created_at: Date;
  updated_at: Date;
  public: boolean;
  registration_open: boolean;
  price: number;
  cover_url: string;
  users: string | IUser;
  _id: string;
}

export type LANAsDocument = ILAN & Document;

const LANSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  created_at: { type: Date, default: new Date, immutable: true },
  last_updated: { type: Date, default: new Date, required: true },
  public: { type: Boolean, default: false, },
  registration_open: { type: Boolean, default: false },
  price: { type: Number, default: 0 },
  cover_url: { type: String, required: true },
  users: [{ type: Schema.Types.ObjectId, ref: 'Users' }]
  // TODO: Implement seats
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - victuals
 */
 LANSchema.pre('save', async function(this: LANAsDocument, next) {
   this.updated_at = new Date();
 });

 /**
  * Methods
  */
 LANSchema.method({});
 
 /**
  * Statics
  */
 LANSchema.statics = {};
 
 export const LanModel: Model<ILAN> = model('Lans', LANSchema);