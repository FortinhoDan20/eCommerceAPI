const express = require('express')
const { createBlog, updateBlog, getAllBlogs, getBlog, deleteBlog, likeBlog, dislikeBlog } = require('../controllers/blog')
const { protect, isAdmin, } = require("../middlewares/authMiddleware");
const router = new express.Router()



router.post('/', protect, isAdmin, createBlog)

router.get('/', getAllBlogs)

router.get('/:id', getBlog)

router.patch('/like-blog', protect, likeBlog)

router.patch('/dislike-blog', protect, dislikeBlog)

router.patch('/:id', protect, isAdmin, updateBlog)

router.patch('/likes/', likeBlog)

router.delete('/:id', protect, isAdmin, deleteBlog)



module.exports = router