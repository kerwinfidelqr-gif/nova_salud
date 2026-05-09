const Sale = require('../models/saleModel');

class SaleService {
    constructor() {}

    async getAll() {
        return await Sale.find().sort({ fecha: -1 });
    }

    async create(data) {
        const sale = new Sale(data);
        return await sale.save();
    }
}

module.exports = SaleService;