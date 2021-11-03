import { Model, model, Schema } from "mongoose";

export interface IPartialUser {
  email: string;
  is_email_verified: boolean;
  username: string;
  refresh_token: string;
  picture_url: string;
  discord_id: string;
  created_at: Date;
  setup_finished: false;
  accent_color: string;
}

export type PartialUserAsDocument = IPartialUser & Document;

const PartialUserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  is_email_verified: {
    type: Boolean,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  refresh_token: {
    type: String,
    required: true,
  },
  picture_url: {
    type: String,
    required: true,
  },
  discord_id: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: new Date,
    immutable: true,
  },
  setup_finished: {
    type: Boolean,
    default: false,
    immutable: true,
  },
  accent_color: { type: String, required: true },
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - victuals
 */
 PartialUserSchema.pre('save', async () => { });

 /**
  * Methods
  */
 PartialUserSchema.method({});
 
 /**
  * Statics
  */
 PartialUserSchema.statics = {};
 
 export const PartialUserModel: Model<IPartialUser> = model('PartialUsers', PartialUserSchema);