const express = require('express')
const router = express.Router()
const Inventario = require('../models/Inventario')
const mongoose = require('mongoose')
const { check, validationResult } = require('express-validator');

// Validaciones para la creación de inventario
const validarInventario = [
    check('serial', 'El serial es requerido').not().isEmpty(),  
    check('modelo', 'El modelo es requerido').not().isEmpty(),  
    check('descripción', 'La descripción es requerida').not().isEmpty(),  
    check('color', 'El color es requerido').not().isEmpty(),  
    check('foto', 'La foto es requerida').not().isEmpty(),  
    check('fechaCompra', 'La fecha de compra es requerida').not().isEmpty(),  
    check('precio', 'El precio es requerido').not().isEmpty(),  
    check('usuario', 'El usuario es requerido').not().isEmpty(),  
    check('marca', 'La marca es requerida').not().isEmpty(),  
    check('tipoEquipo', 'El tipo de equipo es requerido').not().isEmpty(),];

// Crear un Inventario
router.post('/inventario',validarInventario, async(req,res) =>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const existeSerial = await Inventario.findOne({serial: req.body.serial})
    if(existeSerial){
        return res.send('Ya existe el serial para otro Equipo')
    }
       const inventario = Inventario(req.body)
       inventario
       .save()
       .then((data)=> res.json(data))
       .catch((error)=> res.json({message:error}))

})

// Obtener todos los Inventario
router.get('/inventario', (req,res) =>{
    Inventario
    .find()
    .populate('usuario', 'nombre email estado') 
    .populate('marca', 'nombre estado') 
    .populate('tipoEquipo', 'nombre estado') 
    .populate('estadoEquipo', 'nombre estado')
    .then((data)=> res.json(data))
    .catch((error)=> res.json({message:error}))
})

// Obtener Inventario por id
router.get('/inventario/:id', (req,res) =>{
    const{id}= req.params
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: 'El ID debe contener 24 caracteres revisé bien' });
      }
    Inventario
    .findById(id)
    .populate('usuario', 'nombre email estado') 
    .populate('marca', 'nombre estado') 
    .populate('tipoEquipo', 'nombre estado') 
    .populate('estadoEquipo', 'nombre estado')
    .then((data) => {
        if(!data) {
            return res.status(404).json({message: 'El Inventario no existe'})
        }
        res.json(data)
    })
    .catch((error)=> res.json({message:error}))
})

// Actualizar Inventario 
router.put('/inventario/:id', (req,res) =>{
    const{id}= req.params
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: 'El ID debe contener 24 caracteres revisé bien' });
      }
    const{serial,modelo,descripción,color,foto,fechaCompra,
        precio,usuario,marca,tipoEquipo,estadoEquipo,fechaActualizacio} = req.body
    Inventario
    .updateOne({_id:id},{$set:{serial,modelo,descripción,color,foto,fechaCompra,
        precio,usuario,marca,tipoEquipo,estadoEquipo,fechaActualizacio}})
    .then(() => {res.json({message: 'Inventario actualizado exitosamente'})})
    .catch((error)=> res.json({message:error}))
})

// Eliminar Inventario 
router.delete('/inventario/:id', (req,res) =>{
    const{id}= req.params
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: 'El ID debe contener 24 caracteres revisé bien' });
      }
    Inventario
    .findOneAndDelete({_id: id})
    .then(()=> res.status(200).json({message: "Inventario eliminado exitosamente"}))
    .catch((error)=> res.json({message:error}))
})

module.exports=router