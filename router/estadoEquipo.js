const express = require('express')
const router = express.Router()
const EstadoEquipo = require('../models/EstadoEquipo')
const mongoose = require('mongoose');

// Crear  un EstadoEquipo
router.post('/estadoEquipo', (req,res) =>{
       const Eequipo = EstadoEquipo(req.body)
       Eequipo
       .save()
       .then((data)=> res.json(data))
       .catch((error)=> res.json({message:error}))

})

// Obtener todos los EstadoEquipo
router.get('/estadoEquipo', (req,res) =>{
    EstadoEquipo
    .find()
    .then((data)=> res.json(data))
    .catch((error)=> res.json({message:error}))
})

// Obtener EstadoEquipo por id
router.get('/estadoEquipo/:id', (req,res) =>{
    const{id}= req.params
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: 'El ID debe contener 24 caracteres revisé bien' });
      }
    EstadoEquipo
    .findById(id)
    .then((data)=> {
        if (!data) {
            return res.status(404).json({message: 'Estado Equipo no Existe'})
        }
        return res.json(data)
    })
    .catch((error)=> res.json({message:error}))
})

// Actualizar EstadoEquipo
router.put('/estadoEquipo/:id', (req,res) =>{
    const{id}= req.params
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: 'El ID debe contener 24 caracteres revisé bien' });
      }
    const{nombre,estado,fechaActualizacio} = req.body
    EstadoEquipo
    .updateOne({_id:id},{$set:{nombre,estado,fechaActualizacio}})
    .then(() => {res.json({message: 'Estado Equipo actualizado exitosamente'})})
    .catch((error)=> res.json({message:error}))
})

// Eliminar EstadoEquipo 
router.delete('/estadoEquipo/:id', (req,res) =>{
    const{id}= req.params
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: 'El ID debe contener 24 caracteres revisé bien' });
      }
    EstadoEquipo
    .findOneAndDelete({_id: id})
    .then(()=> res.status(200).json({message: "Estado Equipo eliminado exitosamente"}))
    .catch((error)=> res.json({message:error}))
})

module.exports=router