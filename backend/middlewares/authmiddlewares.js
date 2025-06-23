const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const auth = req.headers.authorization;      // Bearer <token>
  if (!auth) return res.sendStatus(401);  // Si no hay token, devolver 401

  const token = auth.split(' ')[1];  // Extrae el token después de "Bearer"
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);  // Verifica el token
    req.user = payload;  // Agrega la información del usuario al objeto req
    next();  // Pasa al siguiente middleware o ruta
  } catch (err) {
    res.sendStatus(403);  // Si el token es inválido o ha expirado, devolver 403
  }
};
