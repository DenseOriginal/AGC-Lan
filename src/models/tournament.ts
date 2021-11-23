import { Model, model, Schema, Document } from "mongoose";
import { LANAsDocument } from "./lan";
import { UserAsDocument } from "./user";

export interface ITournament {
  title: string;
  description: string;
  start: Date;
  end: Date;
  created_at: Date;
  public: boolean;
  hasStarted: boolean;
  users: string[] | UserAsDocument[];
  lan: string | LANAsDocument;
  teamSize: number;
  show_calendar: boolean;
  _id: string;
}

export type TournamentAsDocument = ITournament & Document;

const Tournament = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: '', required: false },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  created_at: { type: Date, default: new Date, immutable: true },
  public: { type: Boolean, required: true },
  hasStarted: { type: Boolean, required: true },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  lan: { type: Schema.Types.ObjectId, ref: 'Lans', required: true },
  teamSize: { type: Number, required: true },
  show_calendar: { type: Boolean, default: true }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - victuals
 */
 Tournament.pre('save', async function(this: TournamentAsDocument, next) {
 });

 /**
  * Methods
  */
 Tournament.method({});
 
 /**
  * Statics
  */
 Tournament.statics = {};
 
 export const TournamentModel: Model<ITournament> = model('Tournament', Tournament);