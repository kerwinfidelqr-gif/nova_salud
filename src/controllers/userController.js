const UserService = require('../services/userService');
const AuthService = require('../services/authService');
const userService = new UserService();
const authService = new AuthService();

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userService.filterById(id);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        let data = req.body;
        // Hashear contraseña antes de guardar
        data.password = await authService.register({ password: data.password }).password;
        // Nota: authService.register devuelve el usuario completo, pero solo necesitamos el password hasheado
        await userService.create(data);
        res.status(201).json({ message: 'Usuario creado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        let data = req.body;
        if (data.password) {
            data.password = await authService.register({ password: data.password }).password;
        }
        const user = await userService.update(id, data);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(200).json({ message: 'Usuario actualizado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await userService.delete(id);
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(200).json({ message: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUsersView = async (req, res) => {
    try {
        const usuarios = await userService.getAll();
        res.render('users', { usuarios, role: req.session.role });
    } catch (error) {
        res.status(500).send('Error al cargar usuarios');
    }
};

exports.deleteUserFromView = async (req, res) => {
    try {
        await userService.delete(req.params.id);
        res.redirect('/users');
    } catch (error) {
        res.status(500).send('Error al eliminar usuario');
    }
};

exports.createUserFromView = async (req, res) => {
    try {
        const AuthService = require('../services/authService');
        const authService = new AuthService();
        let data = req.body;
        data.password = await authService.register({ password: data.password }).password;
        await userService.create(data);
        res.redirect('/users');
    } catch (error) {
        res.status(500).send('Error al crear usuario');
    }
};