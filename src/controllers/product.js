const Product = require("../models/product");
const User = require('../models/user')
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utilis/validateMongodbId");
const { cloudinaryUploadImg } = require("../utilis/cloudinary");

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

const addToWishList = asyncHandler(async(req, res) => {
  try {
    const { _id } = req.user
    const { prodId } = req.body

    const user = await User.findById(_id)
    const alreadyAdded = user.wishlist.find((id) => id.toString() === prodId )

    if(alreadyAdded) {

      let user = await User.findByIdAndUpdate(_id, {$pull: { wishlist: prodId } }, { new: true } )

      res.status(200).json(user)

    }else {
      let user = await User.findByIdAndUpdate(_id, {$push: { wishlist: prodId } }, { new: true } )

      res.status(200).json(user)
    }

  } catch (e) {
    res.status(500).json({ message: e.message })
  }
})

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

const rating = asyncHandler(async(req, res) => {
  try {
    const { _id } = req.user
    const { star, prodId, comment } = req.body

    const product = await Product.findById(prodId)
    let alreadyRated = product.ratings.find((userId) => userId.postEdBy.toString() === _id.toString() )

    if(alreadyRated){
      const updateRating = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated }
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment, "ratings.$.star": star}
        },
        { 
          new: true
        }
      )
    }else {
      const rateProduct = await Product.findByIdAndUpdate(prodId, 
        { $push: { 
          ratings: {
            star:star,
            comment:comment,
            postEdBy: _id

      }}}, { new: true })
      
    }
    const getAllRatings = await Product.findById(prodId)
    let totalRating = getAllRatings.ratings.length
    let ratingSum = getAllRatings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0)
      let actualRating = Math.round(ratingSum / totalRating);
    let totalProd = await Product.findByIdAndUpdate(prodId, { totalRating: actualRating}, { new: true })

    res.status(200).json(totalProd)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
})

const uploadImages = asyncHandler(async(req, res) => {
  try {
    const { id } = req.params
    validateMongoDbId(id)

    const uploader = (path) => cloudinaryUploadImg(path, "images")
    const urls = []
    const files = req.files
    for(const file of files ) {
      const { path } = file
      const newpath = await uploader(path)
      urls.push(newpath)
    }
    const product = await Product.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => { return file })
      },
      {
        new: true
      }
    )
    res.status(200).json(product)
  } catch (e) {
    res.status(500).json({ message: e.message})
  }
})

module.exports = {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  filterProduct,
  addToWishList,
  rating,
  uploadImages
};
