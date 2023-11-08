const Product = require("../models/product");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utilis/validateMongodbId");

const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const product = new Product(req.body);
    await product.save();

    res.status(201).json({
      state: true,
      data: product,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

const getAllProducts = asyncHandler(async (req, res) => {
  try {
    //Filtering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Product.find(JSON.parse(queryStr));

    //Sorting

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    //Limit the fields

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //Pagination

    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error("This Page does not exists");
    }

    const products = await query;
    res.status(200).json({
      state: true,
      data: products,
    });
  } catch (e) {
    res.status(200).json({ message: e.message });
  }
});

const getProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    res.status(200).json({
      state: true,
      data: product,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  try {
    validateMongoDbId(req.params.id);
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.status(200).json({
      state: true,
      message: "Le produit a été mise à jour avec succès",
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    validateMongoDbId(req.params.id);

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      state: true,
      message: "Le produit a été supprimé avec succès",
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

const filterProduct = asyncHandler(async (req, res) => {
  try {
    const { minPrice, maxPrice, color, category, availablity, brand } =
      req.params;

    const filterProduct = await Product.find({
      price: {
        $gte: minPrice,
        $lte: maxPrice,
      },
      category,
      brand,
      availablity,
      color,
    });

    res.status(200).json(filterProduct);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  filterProduct,
};
