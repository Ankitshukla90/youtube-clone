import express from 'express';
import { addComment, deleteComment, getComments, updateComment } from '../controllers/comment.js';
const router = express.Router();

router.post('/', addComment);
router.get('/:videoId', getComments);
router.delete('/:id', deleteComment);
router.put('/:id', updateComment);

export default router;