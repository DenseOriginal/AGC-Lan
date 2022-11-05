import { Model, model, Schema, Document } from "mongoose";
import type { LANAsDocument } from "./lan";
import type { UserAsDocument } from "./user";

export interface ITournament {
  title: string;
  description: string;
  start: Date;
  created_at: Date;
  public: boolean;
  has_started: boolean;
  users: string[] | UserAsDocument[];
  lan: string | LANAsDocument;
  team_size: number;
  show_calendar: boolean;
  _id: string;
}

export type TournamentAsDocument = ITournament & Document;

const Tournament = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: '', required: false },
  start: { type: Date, required: true },
  created_at: { type: Date, default: new Date, immutable: true },
  public: { type: Boolean, default: false },
  has_started: { type: Boolean, default: false },
  users: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
  lan: { type: Schema.Types.ObjectId, ref: 'Lans', required: true },
  team_size: { type: Number, required: true },
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
 
 export const TournamentModel: Model<ITournament> = model<ITournament>('Tournament', Tournament);