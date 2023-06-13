const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const UsuarioSchema = Schema({
  nombre: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  contrasena: { type: String, required: true },
  estado: { type: String, required: true, enum: ["Activo", "Inactivo"] },
  rol: { type: String, required: true, enum: ["administrador", "docente"] },
  permisos: [{ type: String }],
  fechaCreacion: { type: Date, default: Date.now, required: true },
  fechaActualizacion: { type: Date, default: Date.now, required: true },
});

UsuarioSchema.pre("save", async function (next) {
  const usuario = this;

  if (!usuario.isModified("contrasena")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(usuario.contrasena, salt);
  usuario.contrasena = hashedPassword;
  next();
});

module.exports = model("Usuario", UsuarioSchema);
