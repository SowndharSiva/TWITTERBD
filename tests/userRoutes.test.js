const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // make sure to export your express app
const User = require('../models/User');

jest.setTimeout(30000); // 30 seconds timeout

describe('User Routes', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        password: 'password',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toBe('User registered successfully');
  });

  it('should login a user', async () => {
    // First, register the user
    await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        password: 'password',
      });

    // Then, login the user
    const res = await request(app)
      .post('/api/users/login')
      .send({
        username: 'testuser',
        password: 'password',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.token).toBeTruthy();
  });
});
