const User = require('../models/userModel')

// 1. Mostrar la pantalla de login
// Se envía { error: null } para que la primera vez que cargue no muestre ningún mensaje
const showLogin = (req, res) => {
    res.render('login', { error: null })
}

// 2. Procesar los datos cuando le das clic a "Ingresar"
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email.trim(), password: password.trim() });

        if (user) {
            req.session.userId = user._id;
            req.session.role = user.role;

            if (user.role === 'admin') {
                res.redirect('/');
            } else {
                res.redirect('/caja');
            }
        } else {
            // Si el usuario no existe o la clave mal, recargamos la misma página con el error
            res.render('login', { error: 'Correo o contraseña incorrectos.' });
        }

    } catch (error) {
        console.log(error);
        res.status(500).render('login', { error: 'Error en el servidor. Intenta más tarde.' });
    }
}

// 3. Función para cerrar sesión
const logout = (req, res) => {
    // Destruimos la sesión actual en la memoria del servidor
    req.session.destroy(() => {
        // Una vez destruida, lo mandamos de vuelta al login
        res.redirect('/login');
    });
}

// Exportamos las funciones
module.exports = {
    showLogin,
    login,
    logout
}