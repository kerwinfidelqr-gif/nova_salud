const Product = require('../models/productModel');
const Sale = require('../models/saleModel');

const getProducts = async (req, res) => {
    try {
        const productos = await Product.find();
        res.render('index', { productos: productos, role: req.session.role });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error en el servidor');
    }
}

const createProduct = async (req, res) => {
    try {
        const nuevoProducto = new Product(req.body);
        await nuevoProducto.save();
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al guardar');
    }
}

const venderProducto = async (req, res) => {
    try {
        const producto = await Product.findById(req.params.id);
        
        if (producto.stock > 0) {
            producto.stock -= 1;
            await producto.save();

            const nuevaVenta = new Sale({
                productoId: producto._id,
                nombreProducto: producto.nombre,
                precioVenta: producto.precio,
                vendedorId: req.session.userId 
            });
            await nuevaVenta.save();

            const io = req.app.get('socketio');
            
            io.emit('sincronizar-stock', {
                idProducto: producto._id,
                nuevoStock: producto.stock
            });

            if (producto.stock <= producto.minimoStock) {
                io.to('sala_administradores').emit('alerta-stock', {
                    mensaje: `El producto ${producto.nombre} tiene bajo stock (${producto.stock} unidades).`
                });
            }
            
            res.json({ success: true, nuevoStock: producto.stock });
        } else {
            res.json({ success: false, mensaje: 'No hay stock suficiente' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, mensaje: 'Error en el servidor al vender' });
    }
}

const getVentas = async (req, res) => {
    try {
        const ventas = await Sale.find().sort({ fecha: -1 });
        res.render('ventas', { ventas: ventas, role: req.session.role });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al cargar el reporte de ventas');
    }
}

const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al eliminar el producto');
    }
}

// ---> NUEVO: Mostrar el formulario con los datos actuales <---
const showEditForm = async (req, res) => {
    try {
        const producto = await Product.findById(req.params.id);
        res.render('editar', { producto: producto, role: req.session.role });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al cargar el producto para editar');
    }
}

// ---> NUEVO: Guardar los datos actualizados <---
const updateProduct = async (req, res) => {
    try {
        // Busca por ID y actualiza con los nuevos datos del formulario (req.body)
        await Product.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al actualizar el producto');
    }
}

module.exports = {
    getProducts,
    createProduct,
    venderProducto,
    getVentas,
    deleteProduct,
    showEditForm,
    updateProduct  
}