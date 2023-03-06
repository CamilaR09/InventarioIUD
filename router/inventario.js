const express = require('express')
const router = express.Router()
const Inventario = require('../models/Inventario')
const mongoose = require('mongoose')

// Crear un Inventario
router.post('/inventario', async(req,res) =>{
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