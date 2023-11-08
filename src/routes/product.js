const express = require('express')
const { createProduct, getAllProducts, getProduct, updateProduct, deleteProduct } = require('../controllers/product')
const { protect, isAdmin } = require('../middlewares/authMiddleware')
const router = new express.Router()


router.post('/', protect, isAdmin, createProduct)

router.get('/',  getAllProducts)

router.get('/:id', getProduct)

router.patch('/:id', protect, isAdmin, updateProduct)

router.delete('/:id', protect, isAdmin, deleteProduct)


module.exports = router