const User = require('../models/userModel')

// 1. Mostrar la pantalla de login
const showLogin = (req, res) => {
    res.render('login')
}

// 2. Procesar los datos cuando le das clic a "Ingresar"
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email: email.trim(), password: password.trim() });

        if (user) {
            req.session.userId = user._id;
            req.session.role = user.role;
            
            // ---> NUEVO: Redirección inteligente <---
            if (user.role === 'admin') {
                res.redirect('/'); // El admin va al inventario completo
            } else {
                res.redirect('/caja'); // El cajero va directo al punto de venta
            }
        } else {
            res.send('Correo o contraseña incorrectos. Regresa e intenta de nuevo.');
        }

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error en el servidor');
    }
}

// 3. Ruta temporal para crear tu usuario administrador
const crearAdmin = async (req, res) => {
    try {
        const admin = new User({
            name: 'Kerwin Fidel',
            lastname: 'Quispe Roque',
            email: 'kerwinfidelqr@gmail.com',
            password: '123', 
            role: 'admin'
        });
        
        await admin.save();
        res.send('¡Administrador Kerwin creado con éxito! Ya puedes ir a /login e iniciar sesión con la contraseña: 123');
    } catch (error) {
        console.log(error);
        res.send('Hubo un error al crear el admin (tal vez ya existe)');
    }
}

// ---> NUEVO: Función para cerrar sesión <---
const logout = (req, res) => {
    // Destruimos la sesión actual en la memoria del servidor
    req.session.destroy(() => {
        // Una vez destruida, lo mandamos de vuelta al login
        res.redirect('/login');
    });
}

// Exportamos la nueva función
module.exports = {
    showLogin,
    login,
    crearAdmin,
    logout
}