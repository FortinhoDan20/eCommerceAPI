const mongoose = require('mongoose')

const productScheme = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
      },
      slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
      },
      description: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        required: true,
        default: "$"
      },
      category: {
        type: String,
        required: true,
        lowercase: true,
      },
      brand: {
        type: String,
        required: true,
        lowercase: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      sold: {
        type: Number,
        default: 0,
      },
      images: [],
      color: [],
      tags: String,
      ratings: [
        {
          star: Number,
          comment: String,
          postEdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        },
      ],
      totalRating: {
        type: Number,
        default: 0,
      },
}, { timestamps: true })

const Product = mongoose.model('Product', productScheme)
module.exports = Product