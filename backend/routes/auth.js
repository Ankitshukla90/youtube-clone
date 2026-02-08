const express = require('express');
const { login } = require('../controllers/auth'); // Only import login
const router = express.Router();


router.post('/login', login);

module.exports = router;