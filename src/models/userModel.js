const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    lastname: String,
    email: String,
    password: String,
    role: {
        type: String,
        enum: ['admin', 'almacen', 'ventas', 'cliente'],
        default: 'cliente'
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;