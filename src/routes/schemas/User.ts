import { Schema, Document, Mongoose } from 'mongoose';

export interface IRoles extends Document {
  name: string;
  description: string;
  permissions: string[];
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  roles: IRoles[];
}
const userSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: [{ type: Object}],
});
export const UserModel = (mongoose: Mongoose) => {
  return mongoose.model<IUser>("User", userSchema);
} 