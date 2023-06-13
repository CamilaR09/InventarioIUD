const express = require("express");
const router = express.Router();
const Usuario = require("../models/Usuario");
const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator");
const { verifyToken , login } = require("./auth");

// Validaciones para la creación de usuario
const validarUsuario = [
  check("nombre", "El nombre es obligatorio").notEmpty(),
  check("email", "El email es obligatorio").isEmail(),
  check("estado", "El estado es obligatorio").notEmpty(),
  check("contrasena", "La contraseña es obligatoria").notEmpty(),
  check("rol", "El rol es obligatorio").isIn(["administrador", "docente"]),
  check(
    "permisos",
    "Los permisos deben ser un arreglo de strings"
  ).isArray().optional(),
];

router.post("/login", login);

// Crear un usuario
router.post("/users", validarUsuario, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { nombre, email, contrasena, estado, rol } = req.body;
  const existeUsuario = await Usuario.findOne({ email });

  if (existeUsuario) {
    return res.send("Email ya existe");
  }

  const usuario = new Usuario({ nombre, email, contrasena, estado, rol });

  try {
    await usuario.save();
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener todos los usuarios
router.get("/users", async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener usuario por ID
router.get("/users/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "El ID es inválido" });
  }

  try {
    const usuario = await Usuario.findById(id);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el usuario" });
  }
});

// Actualizar usuarios
router.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res
      .status(400)
      .json({ error: "El ID debe contener 24 caracteres revisé bien" });
  }
  const { nombre, email, contrasena, estado, rol } = req.body;
  try {
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no existe" });
    }

    usuario.nombre = nombre;
    usuario.email = email;
    usuario.contrasena = contrasena;
    usuario.estado = estado;
    usuario.rol = rol;
    usuario.fechaActualizacion = Date.now();

    await usuario.save();

    res.json({ message: "Usuario actualizado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Eliminar usuarios
router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res
      .status(400)
      .json({ error: "El ID debe contener 24 caracteres revisa bien" });
  }

  try {
    const usuario = await Usuario.findByIdAndDelete(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no existe" });
    }
    res.status(200).json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
