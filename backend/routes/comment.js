const express = require('express');
const { addComment, deleteComment, getComments } = require('../controllers/comment');
const router = express.Router();

router.post('/', addComment);
router.delete('/:id', deleteComment);
router.get('/:videoId', getComments);

module.exports = router;