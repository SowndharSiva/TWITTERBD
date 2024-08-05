const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../server'); // make sure to export your express app
const User = require('../models/User');
const Tweet = require('../models/Tweet');

jest.setTimeout(30000); // 30 seconds timeout

describe('Tweet Routes', () => {
  let token;
  let userId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create a test user and get JWT token
    const user = new User({ username: 'testuser', password: 'password' });
    await user.save();
    userId = user._id;
    token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Tweet.deleteMany({});
    await mongoose.connection.close();
  });

  it('should post a tweet', async () => {
    const res = await request(app)
      .post('/api/tweets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId,
        text: 'This is a test tweet',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toBe('Tweet posted successfully');
  });

  it('should fetch user timeline', async () => {
    const res = await request(app)
      .get(`/api/users/${userId}/timeline`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          userId: userId.toString(),
          text: 'This is a test tweet',
        }),
      ])
    );
  });
});
