const express = require("express");
const mongoose = require("mongoose");
const app = express();


const port = process.env.PORT || 9000;

//middleware
app.use(express.json());
app.use("/api", require("./router/usuario"));
app.use("/api", require("./router/tipoEquipo"));
app.use("/api", require("./router/marca"));
app.use("/api", require("./router/estadoEquipo"));
app.use("/api", require("./router/inventario"));


//Routes 
app.get('/',(req,res) =>{
   res.send("Hola amor")
})

//Conexion Base de datos
mongoose
  .connect(
    "mongodb+srv://InventarioUDI:g12MgaB6qysl5SJn@cluster0.saavs5v.mongodb.net/Inventario?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connetado a MongoDB Atlas"))
  .catch((error) => console.error(error));

app.listen(port, () =>
  console.log("SERVER UO runnung http://localhost:9000/", port)
);

/*
Usuario:InventarioUDI
Contraseña:9BcHowBCzJ0Fj46L
BD: Inventario
nodemon start
 */
