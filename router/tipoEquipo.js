const express = require('express')
const router = express.Router()
const TipoEquipo = require('../models/TipoEquipo')
const mongoose = require('mongoose')

// Crear un TipoEquipo
router.post('/tipoEquipo', (req,res) =>{
       const TEquipo = TipoEquipo(req.body)
       TEquipo
       .save()
       .then((data)=> res.json(data))
       .catch((error)=> res.json({message:error}))

})

// Obtener todos los TipoEquipo
router.get('/tipoEquipo', (req,res) =>{
    TipoEquipo
    .find()
    .then((data)=> res.json(data))
    .catch((error)=> res.json({message:error}))
})

// Obtener TipoEquipo por id
router.get('/tipoEquipo/:id', (req,res) =>{
    const{id}= req.params
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: 'El ID debe contener 24 caracteres revisé bien' });
      }
    TipoEquipo
    .findById(id)
    .then((data)=> {
        if (!data) {
            return res.status(404).json({message: 'Tipo Equipo no Existe'})
        }
        return res.json(data)
    })
    .catch((error)=> res.json({message:error}))
})

// Actualizar TipoEquipo 
router.put('/tipoEquipo/:id', (req,res) =>{
    const{id}= req.params
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: 'El ID debe contener 24 caracteres revisé bien' });
      }
    const{nombre,estado,fechaActualizacio} = req.body
    TipoEquipo
    .updateOne({_id:id},{$set:{nombre,estado,fechaActualizacio}})
    .then(() => {res.json({message: 'Tipo Equipo actualizado exitosamente'})})
    .catch((error)=> res.json({message:error}))
})

// Eliminar TipoEquipo
router.delete('/tipoEquipo/:id', (req,res) =>{
    const{id}= req.params
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: 'El ID debe contener 24 caracteres revisé bien' });
      }
    TipoEquipo
    .findOneAndDelete({_id: id})
    .then(()=> res.status(200).json({message: "Tipo Equipo eliminado exitosamente"}))
    .catch((error)=> res.json({message:error}))
})

module.exports=router