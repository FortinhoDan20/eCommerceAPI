const express = require('express')
const { protect, isAdmin } = require('../middlewares/authMiddleware')
const { addCategory, getAllCategoryProd, getCategoryProd, updateCategory, deleteCategory } = require('../controllers/categoryProd')
const router = new express.Router()

router.post('/', protect, isAdmin, addCategory)

router.patch('/:id', protect, isAdmin, updateCategory)

router.delete('/:id', protectn, isAdmin, deleteCategory)

router.get('/', getAllCategoryProd)

router.get('/:id', getCategoryProd)



module.exports = router