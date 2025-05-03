const express = require('express');
const router = express.Router();
const db = require('../db');

// CREATE
router.post('/', async (req, res) => {
  const { promedio, rango_min, rango_max } = req.body;
  const [result] = await db.execute(
    'INSERT INTO camara (promedio, rango_min, rango_max) VALUES (?, ?, ?)',
    [promedio, rango_min, rango_max]
  );
  res.json({ id: result.insertId });
});

// READ
router.get('/', async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM camara');
  res.json(rows);
});

// UPDATE
router.put('/:id', async (req, res) => {
  const { promedio, rango_min, rango_max } = req.body;
  await db.execute(
    'UPDATE camara SET promedio = ?, rango_min = ?, rango_max = ? WHERE id = ?',
    [promedio, rango_min, rango_max, req.params.id]
  );
  res.json({ msg: 'Actualizado' });
});

// DELETE
router.delete('/:id', async (req, res) => {
  await db.execute('DELETE FROM camara WHERE id = ?', [req.params.id]);
  res.json({ msg: 'Eliminado' });
});

module.exports = router;
