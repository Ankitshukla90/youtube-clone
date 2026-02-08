import express from 'express';
import { getAllVideos, getVideoById, addVideo, updateVideo, deleteVideo, likeVideo } from '../controllers/video.js';
const router = express.Router();

router.get('/', getAllVideos);
router.get('/find/:id', getVideoById);
router.post('/', addVideo);
router.put('/:id', updateVideo);
router.put('/like/:id', likeVideo);
router.delete('/:id', deleteVideo);

export default router;