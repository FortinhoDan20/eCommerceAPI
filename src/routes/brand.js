const express = require('express')
const { protect, isAdmin } = require('../middlewares/authMiddleware')
const { createBrand, updateBrand, deleteBrand, getBrand, getAllBrands } = require('../controllers/brand')
const router = new express.Router()



router.post('/', protect, isAdmin, createBrand)

router.patch('/:id', protect, isAdmin, updateBrand)

router.delete('/:id', protect, isAdmin, deleteBrand)

router.get('/:id', getBrand)

router.get('/', getAllBrands)

module.exports = router