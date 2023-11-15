const express = require('express')
const { protect, isAdmin } = require('../middlewares/authMiddleware')
const { addCoupon, updateCoupon, deleteCoupon, getAllCoupons, getCoupon } = require('../controllers/coupon')
const router = new express.Router()


router.post('/', protect, isAdmin, addCoupon)

router.patch('/:id', protect, isAdmin, updateCoupon)

router.delete('/:id', protect, isAdmin, deleteCoupon)

router.get('/', protect, isAdmin, getAllCoupons)

router.get('/:id', protect, isAdmin, getCoupon)


module.exports = router