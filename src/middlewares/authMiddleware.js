// middlewares/authMiddleware.js

const verificarSesion = (req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');

    if (req.session && req.session.userId) {
        return next();
    }
    res.redirect('/login');
};

// Middleware genérico que recibe una lista de roles permitidos
const autorizarRoles = (...rolesPermitidos) => {
    return (req, res, next) => {
        if (req.session && rolesPermitidos.includes(req.session.role)) {
            return next();
        }
        res.status(403).send('Acceso denegado: no tienes permisos para esta acción.');
    };
};

module.exports = {
    verificarSesion,
    autorizarRoles
};