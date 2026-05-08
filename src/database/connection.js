const mongoose = require('mongoose');
const config = require('../config');

// Priorizamos la variable de entorno que definimos en Docker Compose
// Si no existe (cuando programas local), usará la de tu archivo config
const connectionString = process.env.MONGODB_URI || config.DB_URI;

mongoose.connect(connectionString)
    .then(() => {
        if (process.env.MONGODB_URI) {
            console.log('Conexión exitosa a MongoDB (Contenedor Docker)');
        } else {
            console.log('Conexión exitosa a MongoDB Atlas (Local)');
        }
    })
    .catch(err => console.error('Error al conectar a la base de datos:', err));

module.exports = mongoose;