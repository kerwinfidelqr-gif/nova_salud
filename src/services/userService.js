const User = require('../models/userModel');

class UserService {
    constructor() {}

    async create(data) {
        const user = new User(data);
        return await user.save();
    }

    async getAll() {
        return await User.find({});
    }

    async filterById(id) {
        return await User.findOne({ _id: id });
    }

    async update(id, data) {
        return await User.findByIdAndUpdate({ _id: id }, data);
    }

    async delete(id) {
        return await User.deleteOne({ _id: id });
    }
}

module.exports = UserService;