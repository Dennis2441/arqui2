const express = require('express');
const router = express.Router();
const db = require('../db');

// CREATE
router.post('/', async (req, res) => {
  const { nombre, cantidad, fecha_caducidad, categoria, temperatura_optima, lote, proveedor } = req.body;
  const [result] = await db.execute(
    'INSERT INTO producto (nombre, cantidad, fecha_caducidad, categoria, temperatura_optima, lote, proveedor) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [nombre, cantidad, fecha_caducidad, categoria, temperatura_optima, lote, proveedor]
  );
  res.json({ id: result.insertId });
});

// READ
router.get('/', async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM producto');
  res.json(rows);
});

// UPDATE
router.put('/:id', async (req, res) => {
  const { nombre, cantidad, fecha_caducidad, categoria, temperatura_optima, lote, proveedor } = req.body;
  await db.execute(
    'UPDATE producto SET nombre=?, cantidad=?, fecha_caducidad=?, categoria=?, temperatura_optima=?, lote=?, proveedor=? WHERE id_producto=?',
    [nombre, cantidad, fecha_caducidad, categoria, temperatura_optima, lote, proveedor, req.params.id]
  );
  res.json({ msg: 'Actualizado' });
});

// DELETE
router.delete('/:id', async (req, res) => {
  await db.execute('DELETE FROM producto WHERE id_producto=?', [req.params.id]);
  res.json({ msg: 'Eliminado' });
});

module.exports = router;
