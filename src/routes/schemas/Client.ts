import { Schema, Document, Mongoose } from 'mongoose';


export interface IClient extends Document {
    name: string;
    surname: string;
    email: string;
    phone_number: number;
    billing_address: string[];
    shipping_address: string[];
    marketing_preferences: string[];
}
const ClientSchema: Schema = new Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone_number: { type: Number },
    billing_address: { type: [String], required: true },
    shipping_address: { type: [String], required: true },
    marketing_preferences: { type: [String] },
});
export const ClientModel = (mongoose: Mongoose) => {
  return mongoose.model<IClient>("Client", ClientSchema);
} 