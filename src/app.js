// src/app.js
const express = require('express');
const path = require('path');
const config = require('./config');
const Product = require('./models/productModel');
const authMiddleware = require('./middlewares/authMiddleware');
require('./database/connection');

const session = require('express-session');
const http = require('http');
const { Server } = require('socket.io');
const app = express();

const server = http.createServer(app);
const io = new Server(server);

app.set('socketio', io);

io.on('connection', (socket) => {
    // Escuchamos cuando la página web nos dice qué rol tiene el usuario conectado
    socket.on('identificar-rol', (rolUsuario) => {
        if (rolUsuario === 'admin') {
            socket.join('sala_administradores'); // Metemos al admin en su sala exclusiva
            console.log('Un administrador entró al sistema de alertas.');
        } else {
            console.log('Un cajero se ha conectado (sin alertas).');
        }
    });
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '../public')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ---> AQUÍ AGREGAMOS EL CANDADO (Sesiones) <---
// Debe ir después de leer el body y antes de las rutas
app.use(session({
    secret: 'nova_salud_secreto_123',
    resave: false,
    saveUninitialized: false
}));
// ------------------------------------------------

const productRouter = require('./routers/productRouter');
app.use('/', productRouter);

const authRouter = require('./routers/authRouter');
app.use('/', authRouter);

// Ruta principal (¡Ahora con el middleware de seguridad!)
app.get('/', authMiddleware.verificarSesion, async (req, res) => {
    try {
        const productos = await Product.find();
        // AHORA TAMBIÉN LE PASAMOS EL ROL A LA VISTA
        res.render('index', { 
            productos: productos, 
            role: req.session.role 
        });
    } catch (error) {
        res.status(500).send('Error al cargar el inventario');
    }
});

// Ruta para el Punto de Venta (Caja)
app.get('/caja', authMiddleware.verificarSesion, async (req, res) => {
    try {
        const productos = await Product.find();
        // Pasamos los productos a la nueva vista 'caja'
        res.render('caja', { 
            productos: productos, 
            role: req.session.role 
        });
    } catch (error) {
        res.status(500).send('Error al cargar la caja');
    }
});

// --- CAMBIO: Usamos server.listen en lugar de app.listen ---
server.listen(config.PORT, () => {
    console.log(`Servidor de Nova Salud corriendo en http://localhost:${config.PORT}`);
});