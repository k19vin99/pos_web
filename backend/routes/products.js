// routes/productos.js
const router  = require('express').Router();
const pool    = require('../config/db');
const upload  = require('../config/upload');

// ───────────────────────────────────────────────────────────── GET
router.get('/', async (_req, res) => {
  const { rows } = await pool.query('SELECT * FROM productos ORDER BY id DESC');
  res.json(rows);
});

// ───────────────────────────────────────────────────────────── POST
router.post('/', upload.single('imagen'), async (req, res) => {
  const { codigo, nombre, marca, stock, precio } = req.body;
  const imagen = req.file ? req.file.filename : null;

  const { rows } = await pool.query(
    'INSERT INTO productos (codigo, nombre, marca, stock, precio, imagen)VALUES ($1, $2, $3, $4, $5, $6)'
    [codigo, nombre, marca, stock, precio, imagen]

  );
  res.status(201).json(rows[0]);
});

// ───────────────────────────────────────────────────────────── PUT
router.put('/:id', upload.single('imagen'), async (req, res) => {
  const { id } = req.params;
  const { codigo, nombre, marca, stock, precio } = req.body;

  const valores = [codigo, nombre, marca, stock, precio]; // $1 - $5
  const sets = [
    'codigo = $1',
    'nombre = $2',
    'marca  = $3',
    'stock  = $4',
    'precio = $5'
  ];

  if (req.file) {
    sets.push('imagen = $6');
    valores.push(req.file.filename); // $6
  }

  valores.push(id); // $7 o $6, depende si hay imagen

  const query = `
    UPDATE productos
    SET ${sets.join(', ')}
    WHERE id = $${valores.length}
    RETURNING *`;

  try {
    const { rows } = await pool.query(query, valores);
    res.json(rows[0]);
  } catch (err) {
    console.error('Error al actualizar producto:', err);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});



module.exports = router;
