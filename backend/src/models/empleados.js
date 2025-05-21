 /*
 Campos:
 nombre
correo
 contrasenia
 telefono
 direccion
 puesto
 fecha_concentracion
 salario
 DUI
 */
import { Schema, model } from "mongoose";

const employeeSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true
    },
    correo: {
      type: String,
      required: true,
      unique: true
    },
    contrasenia: {
      type: String,
      required: true
    },
    telefono: {
      type: String,
      required: true
    },
    direccion: {
      type: String,
      required: true
    },
    puesto: {
      type: String,
      required: true
    },
    fecha_concentracion: {
      type: Date,
      required: true
    },
    salario: {
      type: Number,
      required: true
    },
    DUI: {
      type: String,
      required: true,
      unique: true
    }
  },
  {
    timestamps: true
  }
);

export default model("Empleado", employeeSchema);