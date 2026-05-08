const verificarSesion = (req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');

    if (req.session && req.session.userId) {
        return next();
    }
    
    res.redirect('/login');
}

// ---> NUEVO: Guardián exclusivo para administradores <---
const verificarAdmin = (req, res, next) => {
    // Revisamos si el rol guardado en la sesión es 'admin'
    if (req.session && req.session.role === 'admin') {
        return next(); // Lo dejamos pasar
    }
    
    // Si es cajero o cualquier otra cosa, le bloqueamos el paso y mandamos un error 403 (Prohibido)
    res.status(403).send('Acceso denegado: Solo los administradores pueden registrar medicamentos.');
}

module.exports = {
    verificarSesion,
    verificarAdmin // No olvides exportar esta nueva función
}