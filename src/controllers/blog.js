const Blog = require("../models/blog");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utilis/validateMongodbId");

const createBlog = asyncHandler(async (req, res) => {
  try {
    const blog = new Blog(req.body);

    await blog.save();

    res.status(201).json({
      state: true,
      data: blog,
      message: "Le blog a été crée avec succès",
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    const blogs = await Blog.find().populate(["likes", "dislikes"]);

    res.status(200).json({
      state: true,
      data: blogs,
    });
  } catch (e) {
    res.status(500).json({
      state: false,
      message: e.message,
    });
  }
});

const getBlog = asyncHandler(async (req, res) => {
  try {
    validateMongoDbId(req.params.id);
    const blog = await Blog.findById(req.params.id).populate(["likes", "dislikes"]);
    const updateViews = await Blog.findByIdAndUpdate(
      blog._id,
      { $inc: { numViews: 1 } },
      { new: true }
    );

    res.status(200).json(updateViews);
  } catch (e) {
    res.status(500).json({
      state: false,
      message: e.message,
    });
  }
});

const updateBlog = asyncHandler(async (req, res) => {
  try {
    validateMongoDbId(req.params.id);

    await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.status(200).json({
      state: true,
      message: "Le blog a été mise à jour avec succès",
    });
  } catch (e) {
    res.status(500).json({
      state: false,
      message: e.message,
    });
  }
});

const deleteBlog = asyncHandler(async (req, res) => {
  try {
    validateMongoDbId(req.params.id);
    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({
      state: true,
      message: "Le blog a été supprimé avec succès",
    });
  } catch (e) {
    res.status(500).json({
      state: false,
      message: e.message,
    });
  }
});

const likeBlog = asyncHandler(async (req, res) => {
  try {
    
    const { blogId } = req.body;
    validateMongoDbId(blogId);
    // Find the blog which you want to be liked
    const blog = await Blog.findById(blogId);
    // find the login user
    const loginUserId = req?.user?._id;
    // find if the user has liked the blog
    const isLiked = blog?.isLiked;
    // find if the user has disliked the blog
    const alreadyDisliked = blog?.dislikes?.find(
      (userId) => userId?.toString() === loginUserId?.toString()
    );
    if (alreadyDisliked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false,
        },
        { new: true }
      );
      res.json(blog);
    }
    if (isLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      );
      res.json(blog);
    } else {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { likes: loginUserId },
          isLiked: true,
        },
        { new: true }
      );
      res.json(blog);
    }
  } catch (e) {
    res.status(500).json({
      state: false,
      message: e.message,
    });
  }
});

const dislikeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongoDbId(blogId);
  // Find the blog which you want to be liked
  const blog = await Blog.findById(blogId);
  // find the login user
  const loginUserId = req?.user?._id;
  // find if the user has liked the blog
  const isDisLiked = blog?.isDisliked;
  // find if the user has disliked the blog
  const alreadyLiked = blog?.likes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  if (alreadyLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  }
  if (isDisLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: loginUserId },
        isDisliked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
});
module.exports = {
  createBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  dislikeBlog
};
