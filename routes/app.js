const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const registros = require('./routes/registros.js');
const camara = require('./routes/camara.js');
const producto = require('./routes/producto.js');
const morgan = require('morgan');

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(morgan("tiny"));

app.use('/registros', registros);
app.use('/camara', camara);
app.use('/producto', producto);

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
