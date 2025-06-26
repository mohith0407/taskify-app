const express = require('express');
const { getMe,getAllUsers } = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// Get current user
router.get('/me', protect, getMe);
router.get('/', protect, getAllUsers);
module.exports = router;
