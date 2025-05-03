const mysql = require('mysql2/promise');


const pool = mysql.createPool({
  host: 'eltronco.cohosw60ydrh.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'guate2441',
  database: 'proyecto',
});

module.exports = pool;
