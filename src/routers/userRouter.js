const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verificarSesion, autorizarRoles } = require('../middlewares/authMiddleware');

// Página de gestión de usuarios
router.get('/', verificarSesion, autorizarRoles('admin'), userController.getUsersView);

// Crear usuario desde formulario (redirige a /users)
router.post('/crear', verificarSesion, autorizarRoles('admin'), userController.createUserFromView);

// Eliminar usuario desde formulario (redirige a /users)
router.post('/eliminar/:id', verificarSesion, autorizarRoles('admin'), userController.deleteUserFromView);

// Todas las rutas API llevan el prefijo /api para no chocar con las visuales
router.get('/api', verificarSesion, autorizarRoles('admin'), userController.getAllUsers);
router.get('/api/:id', verificarSesion, autorizarRoles('admin'), userController.getUser);
router.post('/api', verificarSesion, autorizarRoles('admin'), userController.createUser);
router.put('/api/:id', verificarSesion, autorizarRoles('admin'), userController.updateUser);
router.delete('/api/:id', verificarSesion, autorizarRoles('admin'), userController.deleteUser);

module.exports = router;