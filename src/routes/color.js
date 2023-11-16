const express = require('express')
const { addColor, updateColor, deleteColor, getColor, getAllColor } = require('../controllers/color')
const { protect, isAdmin } = require('../middlewares/authMiddleware')
const router = new express.Router()


router.post('/', protect, isAdmin, addColor)

router.patch('/:id', protect, isAdmin, updateColor)

router.delete('/:id', protect, isAdmin, deleteColor)

router.get('/:id', getColor)

router.get('/', getAllColor)


module.exports = router