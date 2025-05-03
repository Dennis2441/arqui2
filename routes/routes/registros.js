const express = require('express');
const router = express.Router();
const db = require('../db');

// CREATE
router.post('/', async (req, res) => {
  const { luz, valor } = req.body;
  const [result] = await db.execute('INSERT INTO registros_sensores (luz, valor) VALUES (?, ?)', [luz, valor]);
  res.json({ id: result.insertId });
});

// READ ALL
router.get('/', async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM registros_sensores');
  res.json(rows);
});

// UPDATE
router.put('/:id', async (req, res) => {
  const { luz, valor } = req.body;
  await db.execute('UPDATE registros_sensores SET luz = ?, valor = ? WHERE id = ?', [luz, valor, req.params.id]);
  res.json({ msg: 'Actualizado' });
});

// DELETE
router.delete('/:id', async (req, res) => {
  await db.execute('DELETE FROM registros_sensores WHERE id = ?', [req.params.id]);
  res.json({ msg: 'Eliminado' });
});

module.exports = router;
