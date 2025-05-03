const express = require('express');
const router = express.Router();
const db = require('../db');

// CREATE
router.post('/crear', async (req, res) => {
  try {
    const { nombre, cantidad, fecha_caducidad, categoria, temperatura_optima, lote, proveedor } = req.body;
    const [result] = await db.execute(
      'INSERT INTO producto (nombre, cantidad, fecha_caducidad, categoria, temperatura_optima, lote, proveedor) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nombre, cantidad, fecha_caducidad, categoria, temperatura_optima, lote, proveedor]
    );
    res.status(200).json({ id: result.insertId, msg: "Producto Creado" }); 
  } catch (error) {
    res.status(400).json({ id: result.insertId, msg: "Error al crear el productoroducto Creado" });
  }
});

// READ
router.get('/listado', async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM producto');
  res.json(rows);
});

router.get('/:id', async (req, res) => {

  const [rows] = await db.execute('SELECT * FROM producto where id_producto =' + req.params.id);
  if(rows[0]){
    res.json(rows[0]);
  }else{
    res.json({});
  }

});

// UPDATE
router.post('/editar/:id', async (req, res) => {
  const { nombre, cantidad, fecha_caducidad, categoria, temperatura_optima, lote, proveedor } = req.body;
  await db.execute(
    'UPDATE producto SET nombre=?, cantidad=?, fecha_caducidad=?, categoria=?, temperatura_optima=?, lote=?, proveedor=? WHERE id_producto=?',
    [nombre, cantidad, fecha_caducidad, categoria, temperatura_optima, lote, proveedor, req.params.id]
  );
  res.json({ msg: 'Actualizado' });
});

// Eliminar
router.post('/eliminar/:id', async (req, res) => {
  await db.execute('DELETE FROM producto WHERE id_producto=?', [req.params.id]);
  res.json({ msg: 'Eliminado' });
});

module.exports = router;
