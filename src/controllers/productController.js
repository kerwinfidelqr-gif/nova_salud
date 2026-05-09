const ProductService = require('../services/productService');
const SaleService = require('../services/saleService');

const productService = new ProductService();
const saleService = new SaleService();

exports.getProducts = async (req, res) => {
    try {
        const productos = await productService.getAll();
        res.render('index', { productos, role: req.session.role });
    } catch (error) {
        res.status(500).send('Error al cargar productos');
    }
};

exports.createProduct = async (req, res) => {
    try {
        await productService.create(req.body);
        req.app.get('socketio').emit('catalogo-actualizado');
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error al crear producto');
    }
};

exports.venderProducto = async (req, res) => {
    try {
        const producto = await productService.getById(req.params.id);
        if (!producto || producto.stock <= 0) {
            return res.json({ success: false, mensaje: 'Sin stock' });
        }

        const productoActualizado = await productService.decreaseStock(producto._id, 1);
        await saleService.create({
            productoId: producto._id,
            nombreProducto: producto.nombre,
            precioVenta: producto.precio,
            vendedorId: req.session.userId
        });

        const io = req.app.get('socketio');
        io.emit('sincronizar-stock', {
            idProducto: producto._id,
            nuevoStock: productoActualizado.stock
        });

        if (productoActualizado.stock <= producto.minimoStock) {
            io.emit('alerta-stock', {
                mensaje: `El producto ${producto.nombre} tiene bajo stock (${productoActualizado.stock} unidades).`
            });
        }

        res.json({ success: true, nuevoStock: productoActualizado.stock });
    } catch (error) {
        res.status(500).json({ success: false, mensaje: 'Error al vender' });
    }
};

exports.venderCarrito = async (req, res) => {
    try {
        const { clienteNombre, clienteDni, productos } = req.body;
        const io = req.app.get('socketio');

        for (let item of productos) {
            const productoDB = await productService.getById(item.id);
            if (productoDB && productoDB.stock >= item.cantidad) {
                await productService.decreaseStock(productoDB._id, item.cantidad);
                await saleService.create({
                    productoId: productoDB._id,
                    nombreProducto: productoDB.nombre,
                    cantidad: item.cantidad,
                    precioVenta: item.precio * item.cantidad,
                    clienteNombre, clienteDni,
                    vendedorId: req.session.userId
                });

                io.emit('sincronizar-stock', {
                    idProducto: productoDB._id,
                    nuevoStock: productoDB.stock - item.cantidad
                });

                if ((productoDB.stock - item.cantidad) <= productoDB.minimoStock) {
                    io.emit('alerta-stock', {
                        mensaje: `El producto ${productoDB.nombre} tiene bajo stock.`
                    });
                }
            }
        }

        io.emit('catalogo-actualizado');
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, mensaje: 'Error procesando carrito' });
    }
};

exports.getVentas = async (req, res) => {
    try {
        const ventas = await saleService.getAll();
        res.render('ventas', { ventas, role: req.session.role });
    } catch (error) {
        res.status(500).send('Error al cargar ventas');
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await productService.delete(req.params.id);
        req.app.get('socketio').emit('catalogo-actualizado');
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error al eliminar producto');
    }
};

exports.showEditForm = async (req, res) => {
    try {
        const producto = await productService.getById(req.params.id);
        res.render('editar', { producto, role: req.session.role });
    } catch (error) {
        res.status(500).send('Error al cargar producto para editar');
    }
};

exports.updateProduct = async (req, res) => {
    try {
        await productService.update(req.params.id, req.body);
        req.app.get('socketio').emit('catalogo-actualizado');
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error al actualizar producto');
    }
};