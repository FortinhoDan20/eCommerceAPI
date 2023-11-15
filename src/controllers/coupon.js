const Coupon = require('../models/coupon')
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require('../utilis/validateMongodbId');


const addCoupon = asyncHandler(async(req, res) => {
    try {
        const coupon = new Coupon(req.body)

        await coupon.save()

        res.status(201).json({
            state: true,
            data: coupon
        })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

const getAllCoupons = asyncHandler(async (req, res) => {
    try {
      const coupons = await Coupon.find();
      res.json(coupons);
    } catch (error) {
      throw new Error(error);
    }
  });
  const updateCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const coupon = await Coupon.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.json(coupon);
    } catch (error) {
      throw new Error(error);
    }
  });
  const deleteCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const coupon = await Coupon.findByIdAndDelete(id);
      res.json(coupon);
    } catch (error) {
      throw new Error(error);
    }
  });
  const getCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const coupon = await Coupon.findById(id);
      res.json(coupon);
    } catch (error) {
      throw new Error(error);
    }
  });

  module.exports = {
    addCoupon, getAllCoupons, getCoupon, updateCoupon, deleteCoupon
  }