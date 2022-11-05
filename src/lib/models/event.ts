import { Model, model, Schema, Document } from "mongoose";

export interface IEvent {
  title: string;
  description: string;
  start: Date;
  end: Date;
  created_at: Date;
  public: boolean;
}

export type EventAsDocument = IEvent & Document;

const Event = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: '', required: false },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  created_at: { type: Date, default: new Date, immutable: true },
  public: { type: Boolean, required: false },
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - victuals
 */
 Event.pre('save', async function(this: EventAsDocument, next) {
 });

 /**
  * Methods
  */
 Event.method({});
 
 /**
  * Statics
  */
 Event.statics = {};
 
 export const EventModel: Model<IEvent> = model<IEvent>('Event', Event);