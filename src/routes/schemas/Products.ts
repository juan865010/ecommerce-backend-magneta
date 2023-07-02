import { Schema, Document, Mongoose } from 'mongoose';

export interface IProducts extends Document {
  nombre:string, 
  descripcion:string, 
  categoria:string, 
  precio:number, 
  cantidadStock:number, 
  imagenes:[string], 
  peso:number,
  dimensiones:string
}
const userSchema: Schema = new Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  categoria: { type: String },
  precio: { type: Number },
  cantidadStock: { type: Number },
  imagenes: { type: [String] },
  peso: { type: Number },
  dimensiones: { type: String },
});

export const ProductsModel = (mongoose: Mongoose) => {
  return mongoose.model<IProducts>("Products", userSchema);
} 