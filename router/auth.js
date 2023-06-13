const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Usuario = require("../models/Usuario");

const secret = "your-secret-key"; // Cambia esto por tu clave secreta real

function generateToken(userId) {
  const payload = {
    userId,
  };

  const options = {
    expiresIn: "1h",
  };

  return jwt.sign(payload, secret, options);
}
async function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.userId = decoded.userId;

    // Verificar permisos aquí
    const usuario = await Usuario.findById(decoded.userId);
    if (!usuario) {
      return res.sendStatus(401);
    }

    if (usuario.rol === "administrador") {
      // Los usuarios con rol "administrador" tienen acceso a todo
      next();
    } else if (usuario.rol === "docente") {
      // Los usuarios con rol "docente" solo pueden acceder a la visualización de inventarios
      if (req.method === "GET" && req.path.startsWith("http://localhost:9000/api/inventario")) {
        next();
      } else {
        return res.sendStatus(403);
      }
    } else {
      return res.sendStatus(403);
    }
  } catch (error) {
    return res.sendStatus(403);
  }
}


async function login(req, res) {
  const { email, contrasena } = req.body;

  try {
    // Verificar si el usuario existe en la base de datos
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }
    console.log("Contraseña ingresada:", contrasena);
    console.log("Contraseña almacenada en la base de datos:", usuario.contrasena);

    // Verificar la contraseña
    const contrasenaValida = await bcrypt.compare(
      contrasena,
      usuario.contrasena
    );
    if (!contrasenaValida) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Generar un token de autenticación
    const token = generateToken(usuario._id);

    // Enviar el token como respuesta
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
}

module.exports = {
  generateToken,
  verifyToken,
  login,
};
