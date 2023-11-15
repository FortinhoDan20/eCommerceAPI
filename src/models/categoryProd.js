const mongoose = require('mongoose')

const categoryProdSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        index: true,
    }
}, {
    timestamps: true,
  })

const CategoryProd = mongoose.model(' CategoryProd', categoryProdSchema)
module.exports = CategoryProd