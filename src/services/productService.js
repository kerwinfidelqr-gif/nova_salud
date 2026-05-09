const Product = require('../models/productModel');

class ProductService {
    constructor() {}

    async getAll() {
        return await Product.find({});
    }

    async getById(id) {
        return await Product.findById(id);
    }

    async create(data) {
        const product = new Product(data);
        return await product.save();
    }

    async update(id, data) {
        return await Product.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return await Product.findByIdAndDelete(id);
    }

    async decreaseStock(id, cantidad) {
        const product = await Product.findById(id);
        if (!product) return null;
        product.stock -= cantidad;
        return await product.save();
    }
}

module.exports = ProductService;