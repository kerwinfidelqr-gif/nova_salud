const AuthService = require('../services/authService');
const authService = new AuthService();

exports.showLogin = (req, res) => {
    res.render('login', { error: null });
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await authService.filterByEmail(email);
        if (!user) {
            return res.render('login', { error: 'Correo o contraseña incorrectos.' });
        }

        const match = authService.comparePassword(password, user.password);
        if (!match) {
            return res.render('login', { error: 'Correo o contraseña incorrectos.' });
        }

        req.session.userId = user._id;
        req.session.role = user.role;
        req.session.token = authService.generateToken({ email: user.email, role: user.role });

        if (user.role === 'admin' || user.role === 'almacen') {
            res.redirect('/');
        } else if (user.role === 'ventas') {
            res.redirect('/caja');
        } else {
            res.redirect('/caja');
        }
    } catch (error) {
        console.log(error);
        res.status(500).render('login', { error: 'Error en el servidor. Intenta más tarde.' });
    }
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
};