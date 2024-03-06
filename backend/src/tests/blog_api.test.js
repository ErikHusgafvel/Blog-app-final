const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const { Blog, User } = require('../models');
const bcrypt = require('bcrypt');
const helper = require('./api_helper');
const { sequelize } = require('../utils/db');

let cookie;
const username = 'root@example.com';
const name = 'root';
const password = 'Password';

describe('when there is initally some blogs and a user saved', () => {
  beforeEach(async () => {
    await Blog.destroy({ where: {} });
    await User.destroy({ where: {} });
    let user;

    // create user
    try {
      const passwordHash = await bcrypt.hash('Password', 10);
      user = await User.create({
        username,
        name,
        passwordHash,
      });
    } catch (err) {
      throw Error('Error: ', { cause: err });
    }

    // create blogs with existing user id
    try {
      const blogs = await Blog.bulkCreate(
        helper.initialBlogs.map((blog) => ({ ...blog, userId: user.id }))
      );
    } catch (err) {
      throw Error('Error: ', { cause: err });
    }

    // login to get cookie
    const response = await api.post('/api/login').send({
      username,
      password,
    });

    cookie = response.headers['set-cookie'];
  });

  test('blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test('returned blog has id, author, url, likes, year and user fields', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body[0].id).toBeDefined();
    expect(response.body[0].author).toBeDefined();
    expect(response.body[0].url).toBeDefined();
    expect(response.body[0].likes).toBeDefined();
    expect(response.body[0].year).toBeDefined();
    expect(response.body[0].user).toBeDefined();
  });

  describe('adding a blog with POST', () => {
    test('a valid blog can be added with status code 201', async () => {
      const newBlog = {
        title:
          '9 things most get wrong about usability testing - and how to fix them',
        author: 'Karri-Pekka Laakso',
        url: 'https://www.reaktor.com/blog/9-things-most-get-wrong-about-usability-testing-and-how-to-fix-them/',
        likes: 5,
      };

      await api
        .post('/api/blogs')
        .set('Cookie', cookie)
        .send(newBlog)
        .expect(201);

      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

      const titles = blogsAtEnd.map((blog) => blog.title);
      expect(titles).toContain(
        '9 things most get wrong about usability testing - and how to fix them'
      );
    });

    test('a valid blog without credentials can not be added with status code 401', async () => {
      const newBlog = {
        title:
          '9 things most get wrong about usability testing - and how to fix them',
        author: 'Karri-Pekka Laakso',
        url: 'https://www.reaktor.com/blog/9-things-most-get-wrong-about-usability-testing-and-how-to-fix-them/',
        likes: 5,
      };

      await api.post('/api/blogs').send(newBlog).expect(401);

      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

      const titles = blogsAtEnd.map((blog) => blog.title);
      expect(titles).not.toContain(
        '9 things most get wrong about usability testing - and how to fix them'
      );
    });
  });
});
