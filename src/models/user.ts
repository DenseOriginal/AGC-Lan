import { Model, model, Schema } from "mongoose";

export interface IUser {
  first_name: string;
  last_name: string;
  email: string;
  is_email_verified: boolean;
  username: string;
  refresh_token: string;
  last_login: Date;
  created_at: Date;
  class: string;
  phone: string;
  banned: boolean;
  notes: string[];
  picture_url: string;
  discord_id: string;
  setup_finished: true;
  accent_color: string;
  role: "USER" | "STAFF" | "ADMIN" | "SUPERADMIN";
  _id: string;
}

export type UserAsDocument = IUser & Document;

const UserSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  is_email_verified: { type: Boolean, required: true },
  username: { type: String, required: true },
  refresh_token: { type: String, required: true },
  last_login: {
    type: Date,
    required: true,
    default: new Date(),
  },
  date_joined: {
    type: Date,
    default: new Date(),
    immutable: true,
  },
  class: { type: String, required: true },
  phone: { type: String, required: false, default: '00000000' },
  banned: { type: Boolean, default: false },
  notes: { type: [String] },
  picture_url: { type: String, required: true },
  discord_id: { type: String, required: true, unique: true },
  setup_finished: { type: Boolean, default: true, immutable: true },
  accent_color: { type: String, required: true },
  role: {
    type: String,
    enum: ['USER', 'STAFF', 'ADMIN', 'SUPERADMIN'],
    default: 'USER',
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - victuals
 */
 UserSchema.pre('save', async () => { });

 /**
  * Methods
  */
 UserSchema.method({});
 
 /**
  * Statics
  */
 UserSchema.statics = {};
 
 export const UserModel: Model<IUser> = model('Users', UserSchema);