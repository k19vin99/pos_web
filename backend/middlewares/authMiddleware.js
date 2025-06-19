const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const auth = req.headers.authorization;      // Bearer <token>
  if (!auth) return res.sendStatus(401);

  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;                        // quedará disponible en la ruta
    next();
  } catch {
    res.sendStatus(403);
  }
};
