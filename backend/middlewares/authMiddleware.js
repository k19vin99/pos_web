const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const auth = req.headers.authorization;      // Bearer <token>
  if (!auth) return res.sendStatus(401);

  const token = auth.split(' ')[1];  // Extrae el token después de "Bearer"
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);  // Verifica el token
    req.user = payload;  // Agrega el payload (información del usuario) a la solicitud
    next();  // Pasa al siguiente middleware o ruta
  } catch (err) {
    res.sendStatus(403);  // Token inválido
  }
};
