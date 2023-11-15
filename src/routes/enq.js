const express = require('express')
const { addEnquiry, updateEnquiry, deleteEnquiry, getAllEnquiry, getEnquiry } = require('../controllers/enq')
const { protect, isAdmin, } = require("../middlewares/authMiddleware");
const router = new express.Router()


router.post('/', addEnquiry)

router.patch('/:id', protect, isAdmin, updateEnquiry)

router.delete('/:id', protect, isAdmin, deleteEnquiry)

router.get('/', getAllEnquiry)

router.get('/:id', getEnquiry)

module.exports = router