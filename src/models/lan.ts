import { Model, model, Schema, Document } from "mongoose";
import { ILANUser } from "./lan-user";

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
  users: string[] | ILANUser[];
  seats: string[];
  _id: string;
  seat_planning_url: string;
}

export type LANAsDocument = ILAN & Document;

const LANSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  created_at: { type: Date, default: new Date, immutable: true },
  last_updated: { type: Date, default: new Date, required: false },
  public: { type: Boolean, default: false, },
  registration_open: { type: Boolean, default: false },
  price: { type: Number, default: 0 },
  cover_url: { type: String, required: true },
  users: [{ type: Schema.Types.ObjectId, ref: 'LanUser' }],
  seats: [String],
  seat_planning_url: { type: String, default: '' }
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