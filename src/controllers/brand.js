const Brand = require('../models/brand')
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require('../utilis/validateMongodbId');



const createBrand = asyncHandler(async(req, res) => {
    try {
        const brand = new Brand(req.body)

        await brand.save()

        res.status(201).json({
            state: true,
            data: brand
        })
    } catch (e) {
        res.status(500).json({
            message: e.message
        })
    }
})

const updateBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const brand = await Brand.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.json({
        state: true,
        message: "Le brand a été modifié avec succès",
        data: brand
      });
    } catch (error) {
      throw new Error(error);
    }
  });
  const deleteBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const brand = await Brand.findByIdAndDelete(id);
      res.json(
        {
            state: true,
            message: "Le brand a été supprimé avec succès",
            
        }
      );
    } catch (error) {
      throw new Error(error);
    }
  });
  const getBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const brand = await Brand.findById(id);
      res.json(
        {
            state: true,
            data: brand
        });
    } catch (error) {
      throw new Error(error);
    }
  });
  const getAllBrands = asyncHandler(async (req, res) => {
    try {
      const brands = await Brand.find();
      res.json(
        {   
            state: true,
            data: brands
        });
    } catch (error) {
      throw new Error(error);
    }
  });

  module.exports = {
    createBrand,
    updateBrand,
    deleteBrand,
    getAllBrands,
    getBrand
  }