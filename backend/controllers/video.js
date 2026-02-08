const Video = require('../models/Video');

// GET ALL VIDEOS (Home Page)
exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.status(200).json(videos);
  } catch (err) {
    res.status(500).json(err);
  }
};

// GET SINGLE VIDEO (Watch Page)
exports.getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    res.status(200).json(video);
  } catch (err) {
    res.status(500).json(err);
  }
};

// CREATE VIDEO (Channel Upload)
exports.addVideo = async (req, res) => {
  try {
    const newVideo = new Video({ ...req.body, user: req.body.userId }); 
    const savedVideo = await newVideo.save();
    res.status(200).json(savedVideo);
  } catch (err) {
    res.status(500).json(err);
  }
};

// DELETE VIDEO
exports.deleteVideo = async (req, res) => {
    try {
        await Video.findByIdAndDelete(req.params.id);
        res.status(200).json("Video has been deleted");
    } catch(err) {
        res.status(500).json(err);
    }
}