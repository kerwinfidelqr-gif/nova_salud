const MessageService = require('./services/messageService');
const messageService = new MessageService();

module.exports = (io) => {
    io.on('connection', async (socket) => {
        // Chat (opcional, para mantener el esquema)
        const messages = await messageService.getAll();
        io.emit('all-messages', messages);

        socket.on('new-message', async (data) => {
            await messageService.create(data);
            const allMessages = await messageService.getAll();
            io.emit('all-messages', allMessages);
        });

        // Eventos de NovaSalud
        socket.on('identificar-rol', (rolUsuario) => {
            if (rolUsuario === 'admin') {
                socket.join('sala_administradores');
                console.log('Admin conectado para alertas');
            }
        });
    });
};