const asyncHandler = require("express-async-handler");
const Category = require('../models/category');
const validateMongoDbId = require("../utilis/validateMongodbId");



const addCategory = asyncHandler(async(req, res) => {
    try {
        const category = new Category(req.body)

        await category.save()

        res.status(201).json(category)

    } catch (e) {
        res.status(500).json({message: e.message })
    }
})

const getAllCategories = asyncHandler(async(req, res) => {
try {
    const categories = await Category.find();
    res.json(categories);
} catch (e) {
    res.status(500).json({message: e.message })
}
})

const getCategory = asyncHandler(async(req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const category = await Category.findById(id);
        res.json(category);
    } catch (e) {
        res.status(500).json({message: e.message })
    }

})

const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.json(updatedCategory);
    } catch (error) {
      throw new Error(error);
    }
  });
  const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const deletedCategory = await Category.findByIdAndDelete(id);
      res.json(deletedCategory);
    } catch (error) {
      throw new Error(error);
    }
  });


  module.exports = { addCategory, getAllCategories, getCategory, updateCategory, deleteCategory}