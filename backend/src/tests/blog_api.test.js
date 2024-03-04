const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const { Blog, User } = require('../models');
const bcrypt = require('bcrypt');
const helper = require('./api_helper');
const { sequelize } = require('../utils/db');

let cookie;

describe('when there is initally some blogs and a user saved', () => {
  beforeEach(async () => {
    await Blog.destroy({ where: {} });
    await User.destroy({ where: {} });
    try {
      const blog = await Blog.create({
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        userId: 1,
      });
    } catch (err) {
      throw Error('Error: ', { cause: err });
    }

    /* const passwordHash = await bcrypt.hash('salainen', 10);
    const user = new User({
      username: 'root',
      passwordHash,
    });

    await user.save();

    const response = await api.post('/api/login').send({
      username: 'root',
      password: 'salainen',
    });

    token = response.body.token; */
  });
  test('blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toHaveLength(0 /* helper.initialBlogs.length */);
  });
});
