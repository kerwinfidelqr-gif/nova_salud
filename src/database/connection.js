const mongoose = require('mongoose');
const config = require('../config');

// Conectamos usando la URI de nuestra configuración
mongoose.connect(config.DB_URI)
    .then(() => console.log('Conexión exitosa a MongoDB Atlas (Nova Salud)'))
    .catch(err => console.error('Error al conectar a la base de datos:', err));

module.exports = mongoose;