//2.Esquema del producto:
import mongoose, { Schema, Document } from 'mongoose';


interface IProduct extends Document {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
  cantidadEnStock: number;
  imagenes: string[];
  peso: number;
  dimensiones: {
    longitud: number;
    anchura: number;
    altura: number;
  };
}

const productSchema: Schema = new Schema({
  id: { type: String, required: true },
  nombre: { type: String, required: true },
  descripcion: { type: String },
  categoria: { type: String },
  precio: { type: Number },
  cantidadEnStock: { type: Number },
  imagenes: [{ type: String }],
  peso: { type: Number },
  dimensiones: {
    longitud: { type: Number },
    anchura: { type: Number },
    altura: { type: Number },
  },
});

export default mongoose.model<IProduct>('Product', productSchema);
