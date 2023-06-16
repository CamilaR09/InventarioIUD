const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const { verifyToken } = require("./router/auth");

const port = process.env.PORT || 9000;
// Middleware
app.use(express.json());
app.use(cors());

// Middleware de verificación de token
app.use("/api/inventario", verifyToken);

//Rutas
app.use("/api", require("./router/usuario"));
app.use("/api", require("./router/tipoEquipo"));
app.use("/api", require("./router/marca"));
app.use("/api", require("./router/estadoEquipo"));
app.use("/api", require("./router/inventario"));

// Routes
app.get("/", (req, res) => {
  res.send("Hola Bienvenidos a API Inventario");
});

// Conexión Base de datos
mongoose
  .connect(
    "mongodb+srv://InventarioUDI:g12MgaB6qysl5SJn@cluster0.saavs5v.mongodb.net/Inventario?retryWrites=true&w=majority"
  )
  .then(() => console.log("Conectado a MongoDB Atlas"))
  .catch((error) => console.error(error));

app.listen(port, () =>
  console.log("Servidor en ejecución en http://localhost:9000/", port)
);


/*
Usuario:InventarioUDI
Contraseña:9BcHowBCzJ0Fj46L
BD: Inventario
nodemon start
 */
