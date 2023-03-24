const express = require('express')
const router = express.Router()
const Usuario = require('../models/Usuario')
const mongoose = require('mongoose')
const { check, validationResult } = require('express-validator');

// Validaciones para la creación de usuario
const validarUsuario = [
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('estado', 'El estado es obligatorio').notEmpty(),];

// Crear un usuario
router.post('/users', validarUsuario,async  (req,res) =>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const existeUsuario = await Usuario.findOne({ email: req.body.email });
        if (existeUsuario) {
             return res.send('Email ya Existe');
            }
       const users = Usuario(req.body)
       users
       .save()
       .then((data)=> res.json(data))
       .catch((error)=> res.json({message:error}))

})

// Obtener todos los usuarios
router.get('/users', (req,res) =>{
    Usuario
    .find()
    .then((data)=> res.json(data))
    .catch((error)=> res.json({message:error}))
})

// Obtener usuarios por id
router.get('/users/:id', (req,res) =>{
    const{id}= req.params
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: 'El ID debe contener 24 caracteres revisé bien' });
      }
    Usuario
    .findById(id)
    .then((data)=> {
        if (!data) {
            return res.status(404).json({message: 'Usuario no Existe'})
        }
        return res.json(data)
    })
    .catch((error) => res.status(500).json({ error: error.message }))
})

// Actualizar usuarios 
router.put('/users/:id', (req,res) =>{
    const{id}= req.params
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: 'El ID debe contener 24 caracteres revisé bien' });
      }
    const{nombre,email,estado,fechaActualizacio} = req.body
    Usuario
    .updateOne({_id:id},{$set:{nombre,email,estado,fechaActualizacio}})
    .then(() => {res.json({message: 'Usuario actualizado exitosamente'})})
    .catch((error)=> res.json({message:error}))
})

// Eliminar usuarios 
router.delete('/users/:id', (req,res) =>{
    const{id}= req.params
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: 'El ID debe contener 24 caracteres revisé bien' });
      }
    Usuario
    .findOneAndDelete({_id: id})
    .then(()=> res.status(200).json({message: "Usuario eliminado exitosamente"}))
    .catch((error)=> res.json({message:error}))
})

module.exports=router