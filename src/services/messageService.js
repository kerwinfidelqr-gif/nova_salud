const Message = require('../models/messageModel');

class MessageService {
    constructor() {}

    async getAll() {
        return await Message.find({});
    }

    async create(msg) {
        const message = new Message(msg);
        return await message.save();
    }
}

module.exports = MessageService;