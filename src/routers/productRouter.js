const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/productos', authMiddleware.verificarSesion, productController.getProducts)
router.post('/productos', authMiddleware.verificarSesion, authMiddleware.verificarAdmin, productController.createProduct)
router.post('/vender/:id', authMiddleware.verificarSesion, productController.venderProducto)
router.get('/ventas', authMiddleware.verificarSesion, authMiddleware.verificarAdmin, productController.getVentas)
router.post('/eliminar/:id', authMiddleware.verificarSesion, authMiddleware.verificarAdmin, productController.deleteProduct)
router.get('/editar/:id', authMiddleware.verificarSesion, authMiddleware.verificarAdmin, productController.showEditForm)
router.post('/editar/:id', authMiddleware.verificarSesion, authMiddleware.verificarAdmin, productController.updateProduct)

module.exports = router