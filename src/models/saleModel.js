const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    nombreProducto: { type: String, required: true },
    precioVenta: { type: Number, required: true },
    vendedorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fecha: { type: Date, default: Date.now } // Guarda la fecha y hora exacta automáticamente
});

module.exports = mongoose.model('Sale', saleSchema);