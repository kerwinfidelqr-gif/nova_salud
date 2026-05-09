const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthService {
    constructor() {}

    async register(data) {
        data.password = bcrypt.hashSync(data.password, 10);
        const user = new User(data);
        return await user.save();
    }

    async filterByEmail(email) {
        return await User.findOne({ email });
    }

    generateToken(payload) {
        return jwt.sign(payload, 'secret-key');
    }

    comparePassword(password, hash) {
        return bcrypt.compareSync(password, hash);
    }
}

module.exports = AuthService;