const express = require('express');
const path = require('path');
const config = require('./config');
const authMiddleware = require('./middlewares/authMiddleware');
require('./database/connection');

const session = require('express-session');
const http = require('http');
const { Server } = require('socket.io');
const morgan = require('morgan');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.set('socketio', io);
require('./socket')(io);  // Sockets externos

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));   // Morgan para logs

app.use(session({
    secret: 'nova_salud_secreto_123',
    resave: false,
    saveUninitialized: false
}));

const productRouter = require('./routers/productRouter');
app.use('/', productRouter);

const authRouter = require('./routers/authRouter');
app.use('/', authRouter);

const userRouter = require('./routers/userRouter');
app.use('/users', userRouter);   // Prefijo como en clase

app.get('/', authMiddleware.verificarSesion, async (req, res) => {
    const Product = require('./models/productModel');
    const productos = await Product.find();
    res.render('index', { productos, role: req.session.role });
});

app.get('/caja', authMiddleware.verificarSesion, async (req, res) => {
    const Product = require('./models/productModel');
    const productos = await Product.find();
    res.render('caja', { productos, role: req.session.role });
});

server.listen(config.PORT, () => {
    console.log(`Servidor corriendo en puerto ${config.PORT}`);
});