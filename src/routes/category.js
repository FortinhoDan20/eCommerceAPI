const express = require('express')
const { protect, isAdmin } = require('../middlewares/authMiddleware')
const { addCategory, getAllCategories, getCategory, updateCategory, deleteCategory } = require('../controllers/category')
const router = new express.Router()


router.post('/', protect, isAdmin, addCategory)

router.get('/', protect, isAdmin, getAllCategories)

router.get('/:id', protect, isAdmin, getCategory)

router.patch('/:id', protect, isAdmin, updateCategory)

router.delete('/:id', protect, isAdmin, deleteCategory)

module.exports = router