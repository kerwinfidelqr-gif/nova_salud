const mongoose = require('mongoose');
const config = require('./config');
const bcrypt = require('bcrypt');
const User = require('./models/userModel');

mongoose.connect(config.DB_URI)
    .then(async () => {
        console.log('Conectado a MongoDB');

        const hash = bcrypt.hashSync('123456', 10);

        const users = [
        { name: 'Admin', lastname: 'Principal', email: 'admin@novasalud.com', password: hash, role: 'admin' },
        { name: 'Carlos', lastname: 'Almacén', email: 'almacen@novasalud.com', password: hash, role: 'almacen' },
        { name: 'María', lastname: 'Ventas', email: 'ventas@novasalud.com', password: hash, role: 'ventas' }
        ];

        await User.insertMany(users);
        console.log('Usuarios creados exitosamente:');
        console.log('admin@novasalud.com / 123456 (admin)');
        console.log('almacen@novasalud.com / 123456 (almacen)');
        console.log('ventas@novasalud.com / 123456 (ventas)');

        mongoose.disconnect();
    })
    .catch(err => {
        console.error('Error al crear usuarios:', err);
        mongoose.disconnect();
    });