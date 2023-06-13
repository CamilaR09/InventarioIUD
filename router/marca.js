const express = require("express");
const router = express.Router();
const Marca = require("../models/Marca");
const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator");
const { verifyToken } = require("./auth");

// Validaciones para la creación de Marca
const validarMarca = [
  check("nombre").notEmpty().withMessage("El campo nombre es obligatorio"),
  check("estado").notEmpty().withMessage("El campo estado es obligatorio"),
];

// Crear una Marca
router.post("/marca", validarMarca, (req, res) => {
  verifyToken(req, res, () => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const marca = Marca(req.body);
    marca
      .save()
      .then((data) => res.json(data))
      .catch((error) => res.json({ message: error }));
  });
});

// Obtener todas las Marca
router.get("/marca", (req, res) => {
  verifyToken(req, res, () => {
    Marca.find()
      .then((data) => res.json(data))
      .catch((error) => res.json({ message: error }));
  });
});

// Obtener Marca  por id
router.get("/marca/:id", (req, res) => {
  verifyToken(req, res, () => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res
        .status(400)
        .json({ error: "El ID debe contener 24 caracteres revisé bien" });
    }
    Marca.findById(id)
      .then((data) => {
        if (!data) {
          return res.status(404).json({ message: "Marca no Existe" });
        }
        return res.json(data);
      })
      .catch((error) => res.json({ message: error }));
  });
});

// Actualizar Marca
router.put("/marca/:id", (req, res) => {
  verifyToken(req, res, () => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res
        .status(400)
        .json({ error: "El ID debe contener 24 caracteres revisé bien" });
    }
    const { nombre, estado, fechaActualizacio } = req.body;
    Marca.updateOne(
      { _id: id },
      { $set: { nombre, estado, fechaActualizacio } }
    )
      .then(() => {
        res.json({ message: "Marca actualizado exitosamente" });
      })
      .catch((error) => res.json({ message: error }));
  });
});

// Eliminar Marca
router.delete("/marca/:id", (req, res) => {
  verifyToken(req, res, () => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res
        .status(400)
        .json({ error: "El ID debe contener 24 caracteres revisé bien" });
    }
    Marca.findOneAndDelete({ _id: id })
      .then(() =>
        res.status(200).json({ message: "Marca eliminado exitosamente" })
      )
      .catch((error) => res.json({ message: error }));
  });
});

module.exports = router;
