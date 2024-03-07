const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const { Blog, User } = require('../models');
const Session = require('../models/session');
const bcrypt = require('bcrypt');
const helper = require('./api_helper');
const { sequelize } = require('../utils/db');

let cookie;
let user;
const username = 'root@example.com';
const name = 'root';
const unauthorizedUsername = 'test@example.com';
const unauthorizedName = 'test';
const password = 'Password';
const passwordHash = bcrypt.hashSync(password, 10);

const getUnauthorizedCookie = async () => {
  await User.create({
    username: unauthorizedUsername,
    name: unauthorizedName,
    passwordHash,
  });
  const response = await api.post('/api/login').send({
    username: unauthorizedUsername,
    password,
  });
  const returnedCookie = response.headers['set-cookie'];
  await api.delete('/api/logout').set('Cookie', returnedCookie).expect(200);
  return returnedCookie;
};

describe('when there is initally some blogs and a user saved', () => {
  beforeEach(async () => {
    await Blog.destroy({ where: {} });
    await User.destroy({ where: {} });
    await Session.destroy({ where: {} });

    // create user
    try {
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

  test("returned blog has fields 'id', 'author', 'url', 'likes', 'year' and 'user'", async () => {
    const response = await api.get('/api/blogs');
    const firstBlog = response.body[0];
    const fields = ['id', 'author', 'url', 'likes', 'year', 'user'];

    fields.forEach((field) => {
      expect(firstBlog).toHaveProperty(field);
    });
  });

  describe('adding a blog with POST', () => {
    test('a valid blog can be added with status code 201', async () => {
      const newBlog = {
        title:
          '9 things most get wrong about usability testing - and how to fix them',
        author: 'Karri-Pekka Laakso',
        url: 'https://www.reaktor.com/blog/9-things-most-get-wrong-about-usability-testing-and-how-to-fix-them/',
        likes: 5,
        year: 2021,
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

    test('a blog without likes and year is accepted with status code 201', async () => {
      const newBlog = {
        title:
          '9 things most get wrong about usability testing - and how to fix them',
        author: 'Karri-Pekka Laakso',
        url: 'https://www.reaktor.com/blog/9-things-most-get-wrong-about-usability-testing-and-how-to-fix-them/',
      };

      await api
        .post('/api/blogs')
        .set('Cookie', cookie)
        .send(newBlog)
        .expect(201);

      const blogsAtEnd = await helper.blogsInDb();
      const titles = blogsAtEnd.map((blog) => blog.title);
      expect(titles).toContain(
        '9 things most get wrong about usability testing - and how to fix them'
      );
      expect(helper.last(blogsAtEnd).likes).toBe(0);
      expect(helper.last(blogsAtEnd).year).toBe(new Date().getFullYear());
    });

    test('returns a 401 code if a blog is added without credentials', async () => {
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

    test('returns a 401 status code if the user is not authorized', async () => {
      const unauthorizedCookie = await getUnauthorizedCookie();

      const newBlog = {
        title:
          '9 things most get wrong about usability testing - and how to fix them',
        author: 'Karri-Pekka Laakso',
        url: 'https://www.reaktor.com/blog/9-things-most-get-wrong-about-usability-testing-and-how-to-fix-them/',
        likes: 5,
      };

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Cookie', unauthorizedCookie)
        .expect(401);
    });

    test('returns a 400 code with a blog without an author', async () => {
      const blogsAtStart = await helper.blogsInDb();

      const newBlog = {
        title:
          '9 things most get wrong about usability testing - and how to fix them',
        url: 'https://www.reaktor.com/blog/9-things-most-get-wrong-about-usability-testing-and-how-to-fix-them/',
        likes: 4,
      };

      await api
        .post('/api/blogs')
        .set('Cookie', cookie)
        .send(newBlog)
        .expect(400);

      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
    });

    test('returns a 400 code with a blog without a url', async () => {
      const blogsAtStart = await helper.blogsInDb();

      const newBlog = {
        title:
          '9 things most get wrong about usability testing - and how to fix them',
        author: 'Karri-Pekka Laakso',
        likes: 4,
      };

      await api
        .post('/api/blogs')
        .set('Cookie', cookie)
        .send(newBlog)
        .expect(400);

      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
    });

    test('returns a 400 code with a blog without a title', async () => {
      const blogsAtStart = await helper.blogsInDb();

      const newBlog = {
        author: 'Karri-Pekka Laakso',
        url: 'https://www.reaktor.com/blog/9-things-most-get-wrong-about-usability-testing-and-how-to-fix-them/',
        likes: 4,
      };

      await api
        .post('/api/blogs')
        .set('Cookie', cookie)
        .send(newBlog)
        .expect(400);

      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
    });
  });

  describe('removing a blog with DELETE', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      // Create a new blog post
      const newBlog = {
        title:
          '9 things most get wrong about usability testing - and how to fix them',
        author: 'Karri-Pekka Laakso',
        url: 'https://www.reaktor.com/blog/9-things-most-get-wrong-about-usability-testing-and-how-to-fix-them/',
      };

      const response = await api
        .post('/api/blogs')
        .set('Cookie', cookie)
        .send(newBlog)
        .expect(201);

      // Delete the blog post
      const blogToDelete = response.body;
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Cookie', cookie)
        .expect(204);

      // Verify that the blog post was deleted
      const blogsAtEnd = await helper.blogsInDb();
      const titlesAtEnd = blogsAtEnd.map((blog) => blog.title);
      expect(titlesAtEnd).not.toContain(newBlog.title);
    });

    test('returns a 401 status code if the user is not authorized', async () => {
      const blogs = await helper.blogsInDb();
      const blog = blogs[0]; // blog belongs to the

      const unauthorizedCookie = await getUnauthorizedCookie();

      await api
        .delete(`/api/blogs/${blog.id}`)
        .set('Cookie', unauthorizedCookie)
        .expect(401);
    });

    test('returns a 404 if non-existing blog with valid id', async () => {
      const id = await helper.nonExistingId(user.id);
      const blogsAtStart = await helper.blogsInDb();

      await api.delete(`/api/blogs/${id}`).set('Cookie', cookie).expect(404);

      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
    });

    test('returns a 400 if invalid id', async () => {
      const invalidId = '5a3d5da59070081a82a3445';
      const blogsAtStart = await helper.blogsInDb();

      await api
        .delete(`/api/blogs/${invalidId}`)
        .set('Cookie', cookie)
        .expect(400);

      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
    });
  });

  describe('updating likes for a blog with PUT', () => {
    test('adding one like to an existing blog', async () => {
      const blogs = await helper.blogsInDb();
      const blog = blogs[0];
      const newLikes = blog.likes + 1;

      const response = await api
        .put(`/api/blogs/${blog.id}`)
        .send({ likes: newLikes })
        .set('Cookie', cookie)
        .expect(200);

      expect(response.body.likes).toBe(newLikes);
    });

    test('returns a 401 status code if the user is not authorized', async () => {
      const blogs = await helper.blogsInDb();
      const blog = blogs[0];

      const unauthorizedCookie = await getUnauthorizedCookie();

      await api
        .put(`/api/blogs/${blog.id}`)
        .send({ likes: blog.likes + 1 })
        .set('Cookie', unauthorizedCookie)
        .expect(401);
    });

    test('returns a 400 status code if the likes value is negative', async () => {
      const blogs = await helper.blogsInDb();
      const blog = blogs[0];

      await api
        .put(`/api/blogs/${blog.id}`)
        .send({ likes: -1 })
        .set('Cookie', cookie)
        .expect(400);
    });

    test('returns a 400 status code if the likes value is not a number', async () => {
      const blogs = await helper.blogsInDb();
      const blog = blogs[0];

      await api
        .put(`/api/blogs/${blog.id}`)
        .send({ likes: 'not a number' })
        .set('Cookie', cookie)
        .expect(400);
    });
  });
});
