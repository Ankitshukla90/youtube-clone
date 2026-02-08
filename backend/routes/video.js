const express = require('express');
const { getAllVideos, getVideoById, addVideo, deleteVideo } = require('../controllers/video');
const router = express.Router();

router.get('/', getAllVideos);
router.get('/find/:id', getVideoById);
router.post('/', addVideo);
router.delete('/:id', deleteVideo);

module.exports = router;