const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    nombreProducto: { type: String, required: true },
    cantidad: { type: Number, default: 1 }, // NUEVO: Cantidad comprada
    precioVenta: { type: Number, required: true }, // Subtotal de esta línea
    clienteNombre: { type: String, default: 'Público General' }, // NUEVO: Datos del paciente
    clienteDni: { type: String, default: 'S/N' }, // NUEVO: DNI del paciente
    vendedorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fecha: { type: Date, default: Date.now } 
});

module.exports = mongoose.model('Sale', saleSchema);