const { Schema , model } = require('mongoose')

const MarcaSchema = Schema({
    nombre: {type:String,required:true,unique:true},
    estado: {type:String,required:true, enum:['Activo','Inactivo']},
    fechaCreacion: {type:Date,default: Date.now,required: true},
    fechaActualizacion:{type:Date,default: Date.now,required: true}
})
module.exports = model('Marca',MarcaSchema)