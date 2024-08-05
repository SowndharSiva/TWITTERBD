const Tweet = require('../models/Tweet');

exports.postTweet = async (req, res) => {
  const { userId, text } = req.body;
  try {
    const tweet = new Tweet({ userId, text });
    await tweet.save();
    res.status(201).json({ message: 'Tweet posted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getTimeline = async (req, res) => {
  const { userId } = req.params;
  try {
    const tweets = await Tweet.find({ userId }).sort({ createdAt: -1 });
    res.json(tweets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getTimeline = async (req, res) => {
    const { userId } = req.params;
    const { cursor, limit = 10 } = req.query;
  
    try {
      const query = { userId };
      if (cursor) {
        query._id = { $lt: cursor };
      }
  
      const tweets = await Tweet.find(query)
        .sort({ _id: -1 })
        .limit(parseInt(limit));
  
      const nextCursor = tweets.length ? tweets[tweets.length - 1]._id : null;
  
      res.json({
        tweets,
        nextCursor,
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  