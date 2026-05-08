const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

// Ruta para ver la página de login
router.get('/login', authController.showLogin)

// Ruta que procesa el formulario cuando haces clic en "Ingresar"
router.post('/login', authController.login)

// Ruta secreta para generar tu usuario en la base de datos
router.get('/crear-admin', authController.crearAdmin)

// ---> NUEVO: Ruta para cerrar sesión <---
router.get('/logout', authController.logout)

module.exports = router