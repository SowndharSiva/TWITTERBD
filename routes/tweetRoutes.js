const express = require('express');
const { postTweet, getTimeline } = require('../controllers/tweetController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', auth, postTweet);
router.get('/:userId/timeline', auth, getTimeline);

module.exports = router;
