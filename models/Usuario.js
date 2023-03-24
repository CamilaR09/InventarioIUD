const {Schema, model} = require('mongoose')

const UsuarioSchema = Schema({
    nombre: {type: String,required:true},
    email: {type: String,unique:true,required: true},
    estado: {type:String,required:true, enum:['Activo','Inactivo']},
    fechaCreacion: {type:Date,default: Date.now,required: true},
    fechaActualizacion:{type:Date,default: Date.now,required: true}
})
module.exports = model('Usuario',UsuarioSchema)