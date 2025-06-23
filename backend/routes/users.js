const router = require('express').Router();
const pool = require('../config/db');
const upload = require('../config/upload');
const bcrypt = require('bcrypt');
const authenticate = require('../middleware/authmiddlewares');  // Middleware para autenticación

// ───────────────────────────────────────────────────────────── GET (obtener todos los usuarios)
router.get('/', authenticate, async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM usuarios ORDER BY id DESC');
    res.json(rows);  // Retornar todos los usuarios
  } catch (err) {
    console.error('Error al obtener usuarios:', err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// ───────────────────────────────────────────────────────────── POST (crear un nuevo usuario)
router.post('/', upload.single('avatar'), async (req, res) => {
  const { nombre, email, password } = req.body;
  const avatar = req.file ? req.file.filename : null;

  // Encriptar la contraseña antes de guardarla
  const hashedPassword = await bcrypt.hash(password, 10);  // 10 es el saltRounds

  try {
    const { rows } = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, avatar) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, email, hashedPassword, avatar]
    );
    res.status(201).json(rows[0]);  // Retornar el nuevo usuario creado
  } catch (err) {
    console.error('Error al crear usuario:', err);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// ───────────────────────────────────────────────────────────── PUT (actualizar un usuario existente)
router.put('/:id', upload.single('avatar'), async (req, res) => {
  const { id } = req.params;
  const { nombre, email, password } = req.body;

  const valores = [nombre, email];
  const sets = [
    'nombre = $1',
    'email = $2'
  ];

  if (password) {
    // Encriptar la nueva contraseña si se ha proporcionado
    const hashedPassword = await bcrypt.hash(password, 10);  // 10 es el saltRounds
    sets.push('password = $3');
    valores.push(hashedPassword);
  }

  if (req.file) {
    sets.push('avatar = $4');
    valores.push(req.file.filename);  // $4
  }

  valores.push(id);  // $5

  const query = `
    UPDATE usuarios
    SET ${sets.join(', ')}
    WHERE id = $${valores.length}
    RETURNING *`;

  try {
    const { rows } = await pool.query(query, valores);
    res.json(rows[0]);  // Retornar el usuario actualizado
  } catch (err) {
    console.error('Error al actualizar usuario:', err);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// ───────────────────────────────────────────────────────────── DELETE (eliminar un usuario)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { rowCount } = await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(204).send();  // Responder con estado 204 (sin contenido) después de eliminar
  } catch (err) {
    console.error('Error al eliminar usuario:', err);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

// ───────────────────────────────────────────────────────────── EXPORT
module.exports = router;
