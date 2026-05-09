const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verificarSesion, autorizarRoles } = require('../middlewares/authMiddleware');

router.get('/productos', verificarSesion, autorizarRoles('admin', 'almacen'), productController.getProducts);
router.post('/productos', verificarSesion, autorizarRoles('admin', 'almacen'), productController.createProduct);
router.post('/vender/:id', verificarSesion, autorizarRoles('admin', 'ventas'), productController.venderProducto);
router.post('/vender-carrito', verificarSesion, autorizarRoles('admin', 'ventas'), productController.venderCarrito);
router.get('/ventas', verificarSesion, autorizarRoles('admin'), productController.getVentas);
router.post('/eliminar/:id', verificarSesion, autorizarRoles('admin', 'almacen'), productController.deleteProduct);
router.get('/editar/:id', verificarSesion, autorizarRoles('admin', 'almacen'), productController.showEditForm);
router.post('/editar/:id', verificarSesion, autorizarRoles('admin', 'almacen'), productController.updateProduct);

module.exports = router;