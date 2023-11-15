const asyncHandler = require("express-async-handler");
const CategoryProd = require('../models/categoryProd');
const validateMongoDbId = require("../utilis/validateMongodbId");


const addCategory = asyncHandler(async(req, res) => {
    try {
        const category = new CategoryProd(req.body)
        await category.save()

        res.status(201).json(category)
    } catch (e) {
        res.status(500).json({ message: e.message})
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
  const getCategoryProd = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const getaCategory = await Category.findById(id);
      res.json(getaCategory);
    } catch (error) {
      throw new Error(error);
    }
  });
  const getAllCategoryProd = asyncHandler(async (req, res) => {
    try {
      const getallCategory = await Category.find();
      res.json(getallCategory);
    } catch (error) {
      throw new Error(error);
    }
  });

  module.exports = {
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryProd,
    getAllCategoryProd,
  };