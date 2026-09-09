const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  try {
    const { title, content, isPublished } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    const post = await Post.create({
      title,
      content,
      isPublished: isPublished === "true" || isPublished === true,
      image,
      student: req.studentId,
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("student", "name email");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("student", "name email");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { title, content, isPublished } = req.body;
    const update = { title, content };
    if (isPublished !== undefined) {
      update.isPublished = isPublished === "true" || isPublished === true;
    }
    if (req.file) {
      update.image = `/uploads/${req.file.filename}`;
    }

    const post = await Post.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
