const express = require("express");
const router = express.Router();
const Inventario = require("../models/Inventario");
const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator");
const { verifyToken } = require("./auth");

// Validaciones para la creación de inventario
const validarInventario = [
 
];

// Crear un Inventario
router.post("/inventario", validarInventario, async (req, res) => {
  verifyToken(req, res, async () => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const existeSerial = await Inventario.findOne({ serial: req.body.serial });
    if (existeSerial) {
      return res
        .status(422)
        .json({ errors: [{ msg: "Ya existe el serial para otro Equipo" }] });
    }
    const inventario = Inventario(req.body);
    inventario
      .save()
      .then((data) => res.json(data))
      .catch((error) => res.json({ message: error }));
  });
});

// Obtener todos los Inventario
router.get("/inventario", (req, res) => {
  verifyToken(req, res, () => {
    Inventario.find()
      .populate("usuario", "nombre email estado")
      .populate("marca", "nombre estado")
      .populate("tipoEquipo", "nombre estado")
      .populate("estadoEquipo", "nombre estado")
      .then((data) => res.json(data))
      .catch((error) => res.json({ message: error }));
  });
});

// Obtener Inventario por id
router.get("/inventario/:id", (req, res) => {
  verifyToken(req, res, () => {
    const { id } = req.params;

    Inventario.findById(id)
      .populate("usuario", "nombre email estado")
      .populate("marca", "nombre estado")
      .populate("tipoEquipo", "nombre estado")
      .populate("estadoEquipo", "nombre estado")
      .then((data) => {
        if (!data) {
          return res.status(404).json({ message: "El Inventario no existe" });
        }
        res.json(data);
      })
      .catch((error) => res.json({ message: error }));
  });
});

// Actualizar Inventario
router.put("/inventario/:id", (req, res) => {
  verifyToken(req, res, () => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res
        .status(400)
        .json({ error: "El ID debe contener 24 caracteres revisé bien" });
    }
    if (!id) {
      return res.status(400).json({ error: "Inventario no existe" });
    }
    const {
      serial,
      modelo,
      descripción,
      color,
      foto,
      fechaCompra,
      precio,
      usuario,
      marca,
      tipoEquipo,
      estadoEquipo,
      fechaActualizacio,
    } = req.body;
    Inventario.updateOne(
      { _id: id },
      {
        $set: {
          serial,
          modelo,
          descripción,
          color,
          foto,
          fechaCompra,
          precio,
          usuario,
          marca,
          tipoEquipo,
          estadoEquipo,
          fechaActualizacio,
        },
      }
    )
      .then(() => {
        res.json({ message: "Inventario actualizado exitosamente" });
      })
      .catch((error) => res.json({ message: error }));
  });
});

// Eliminar Inventario
router.delete("/inventario/:id", (req, res) => {
  verifyToken(req, res, () => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res
        .status(400)
        .json({ error: "El ID debe contener 24 caracteres revisé bien" });
    }
    Inventario.findOneAndDelete({ _id: id })
      .then(() =>
        res.status(200).json({ message: "Inventario eliminado exitosamente" })
      )
      .catch((error) => res.json({ message: error }));
  });
});

module.exports = router;
