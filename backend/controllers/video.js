import Video from '../models/Video.js';

export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.status(200).json(videos);
  } catch (err) { res.status(500).json(err); }
};

export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    video.views += 1; // Increment view count
    await video.save();
    res.status(200).json(video);
  } catch (err) { res.status(500).json(err); }
};

export const addVideo = async (req, res) => {
  try {
    const newVideo = new Video({ ...req.body, user: req.body.userId }); 
    const savedVideo = await newVideo.save();
    res.status(200).json(savedVideo);
  } catch (err) { res.status(500).json(err); }
};

export const updateVideo = async (req, res) => {
  try {
    const updatedVideo = await Video.findByIdAndUpdate(
        req.params.id, 
        { $set: req.body }, 
        { new: true }
    );
    res.status(200).json(updatedVideo);
  } catch (err) { res.status(500).json(err); }
};

export const deleteVideo = async (req, res) => {
    try {
        await Video.findByIdAndDelete(req.params.id);
        res.status(200).json("Video deleted");
    } catch(err) { res.status(500).json(err); }
};

export const likeVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if(req.body.type === 'like') video.likes += 1;
        else video.dislikes += 1;
        await video.save();
        res.status(200).json(video);
    } catch(err) { res.status(500).json(err); }
};