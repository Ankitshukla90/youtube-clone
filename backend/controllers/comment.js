const Comment = require('../models/Comment');

// ADD COMMENT
exports.addComment = async (req, res) => {
  const newComment = new Comment({ ...req.body });
  try {
    const savedComment = await newComment.save();
    res.status(200).json(savedComment);
  } catch (err) {
    res.status(500).json(err);
  }
};

// GET COMMENTS FOR VIDEO
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId }).sort({createdAt: -1});
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json(err);
  }
};

// DELETE COMMENT
exports.deleteComment = async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json("The comment has been deleted.");
  } catch (err) {
    res.status(500).json(err);
  }
};