const express = require('express')
const { createProduct, getAllProducts, getProduct, updateProduct, deleteProduct, addToWishList, rating, uploadImages } = require('../controllers/product')
const { protect, isAdmin } = require('../middlewares/authMiddleware')
const { uploadPhoto, productImgResize } = require('../middlewares/uploadImg')
const router = new express.Router()


router.post('/', protect, isAdmin, createProduct)

router.get('/',  getAllProducts)

router.get('/:id', getProduct)

router.patch('/upload/:id', protect, isAdmin, uploadPhoto.array("images", 10), productImgResize, uploadImages)

router.patch('/rating', protect, rating)

router.patch('/wishlist',protect, addToWishList )

router.patch('/:id', protect, isAdmin, updateProduct)

router.delete('/:id', protect, isAdmin, deleteProduct)


module.exports = router