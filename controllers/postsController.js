import Post from "../models/postsModel.js"; // Assuming your model is named Post
import Comment from "../models/commentModel.js";
import { countLikesForPost } from "./likesController.js";
import fs from "fs";

export const createPost = async (req, res) => {
  try {
    const { title, author, category, content } = req.fields;
    const { photo } = req.files;
    switch (true) {
      case !title:
        return res.status(400).send({ error: "Title is Required" });
      case !author:
        return res.status(400).send({ error: "Author name is Required" });
      case !category:
        return res.status(400).send({ error: "Category is Required" });
      case !content:
        return res.status(400).send({ error: "Content is Required" });
      case !photo:
        return res.status(400).send({ error: "Photo is Required" });
      case photo.size > 1000000:
        return res.status(400).send({ error: "Photo should be less than 1mb" });
    }
    const newPost = new Post({
      title,
      author,
      category,
      content,
      user: req.user._id,
    });

    if (photo) {
      newPost.photo.data = fs.readFileSync(photo.path);
      newPost.photo.contentType = photo.type;
    }
    await newPost.save();
    res.status(201).send({
      success: true,
      message: "Post Created Successfully",
      post: newPost,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating post",
    });
  }
};

export const getAPost = async (req, res) => {
  try {
    const posts = await Post.find({})
      .select("-photo")
      .limit(12)
      .sort({ createdAt: 1 });

    // Wrap the posts in an array
    const postsArray = Array.isArray(posts) ? posts : [posts];

    res.status(200).send({
      success: true,
      countTotal: postsArray.length,
      message: "AllPosts",
      posts: postsArray,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in fetching posts",
    });
  }
};

// get photo
export const postPhoto = async (req, res) => {
  try {
    const post = await Post.findById(req.params.pid).select("photo");
    if (post.photo.data) {
      res.set("Content-type", post.photo.contentType);
      return res.status(200).send(post.photo.data);
    }
  } catch (error) {
    // console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr while getting photo",
      error,
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    // console.log('Request Body:', req.body);

    const postId = req.params.pid;
    const userId = req.user._id;

    const { title, author, category, content } = req.fields;
    const { photo } = req.files;

    // Find the post by ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).send({ error: 'Post not found' });
    }

    // Check if the user is the owner of the post
    if (post.user.toString() !== userId.toString()) {
      return res.status(403).send({ error: 'Permission denied' });
    }
    switch (true) {
      case !title:
        return res.status(400).send({ error: "Title is Required" });
      case !author:
        return res.status(400).send({ error: "Author name is Required" });
      case !category:
        return res.status(400).send({ error: "Category is Required" });
      case !content:
        return res.status(400).send({ error: "Content is Required" });
      case !photo:
        return res.status(400).send({ error: "Photo is Required" });
      case photo.size > 1000000:
        return res.status(400).send({ error: "Photo should be less than 1mb" });
    }
    post.title = title;
    post.author = author;
    post.category = category;
    post.content = content;

    if (photo) {
      post.photo.data = fs.readFileSync(photo.path);
      post.photo.contentType = photo.type;
    }

    await post.save();

    res.status(200).send({ success: true, message: 'Post modified successfully', post });
  } catch (error) {
    // console.error(error);
    res.status(500).send({ success: false, error, message: 'Error modifying post' });
  }
};

export const getPostById = async (req, res) => {
  try {
    const postId = req.params.pid;

    // Find the post by ID, excluding the photo field
    const post = await Post.findById(postId).select('-photo');

    if (!post) {
      return res.status(404).send({ error: 'Post not found' });
    }

    // Find comments related to this post
    const comments = await Comment.find({ post: postId });
    const likes  = await countLikesForPost(postId);
    res.status(200).send({ success: true, message: 'Post found', post, comments, likes });
  } catch (error) {
    // console.error(error);
    res.status(500).send({ success: false, error, message: 'Error getting post by ID' });
  }
};



export const deletePost = async (req, res) => {
  try {
    const postId = req.params.pid;
    const userId = req.user._id;

    // Find the post by ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).send({ error: 'Post not found' });
    }

    // Check if the user is the owner of the post
    if (post.user.toString() !== userId.toString()) {
      return res.status(403).send({ error: 'Permission denied' });
    }

    // Delete the post and its associated photo
    // if (post.photo.data) {
    //   fs.unlinkSync(`path_to_your_upload_folder/${postId}.${post.photo.contentType.split('/')[1]}`);
    // }

    await Post.findByIdAndDelete(postId);

    res.status(200).send({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    // console.error(error);
    res.status(500).send({ success: false, error, message: 'Error deleting post' });
  }
};


export const getPostsByUserId = async (req, res) => {
  try {
    const userId = req.params.pid; // Assuming you pass the user ID as a parameter in the URL
    const posts = await Post.find({ user: req.user._id }).exec();

    if (!posts) {
      return res.status(404).send({ error: "No posts found for this user" });
    }

    res.status(200).send({
      success: true,
      message: "Posts retrieved successfully",
      posts,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in retrieving posts",
    });
  }
};