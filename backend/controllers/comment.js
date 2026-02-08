import Comment from '../models/Comment.js';

export const addComment = async (req, res) => {
  try {
    const newComment = new Comment({ ...req.body });
    const savedComment = await newComment.save();
    res.status(200).json(savedComment);
  } catch (err) { res.status(500).json(err); }
};

export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId }).sort({createdAt: -1});
    res.status(200).json(comments);
  } catch (err) { res.status(500).json(err); }
};

export const deleteComment = async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json("Comment deleted");
  } catch (err) { res.status(500).json(err); }
};

export const updateComment = async (req, res) => {
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
        req.params.id,
        { $set: { text: req.body.text } },
        { new: true }
    );
    res.status(200).json(updatedComment);
  } catch (err) { res.status(500).json(err); }
};