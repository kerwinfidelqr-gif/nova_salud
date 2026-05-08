const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Mongo crea un id automático
const ProductSchema = new Schema({
    nombre: String,
    precio: String,
    stock: Number,
    minimoStock: Number
})

// Creamos el modelo de producto
const Product = mongoose.model('Product', ProductSchema)

module.exports = Product