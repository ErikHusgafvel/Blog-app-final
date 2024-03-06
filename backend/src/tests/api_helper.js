const { Blog, User } = require('../models');

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
    likes: 10,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  },
];

const nonExistingId = async (userId) => {
  const newBlog = await Blog.create({
    title: 'testing',
    author: 'testing',
    url: 'testing.com',
    userId,
  });
  await Blog.destroy({ where: { id: newBlog.id } });
  return newBlog.id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.findAll({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.findAll({});
  return users.map((user) => user.toJSON());
};

/**
 * Helper function to get the last element of an array.
 * @param {Array} array - The array to get the last element from.
 * @returns {*} The last element of the array.
 */
const last = (array) => array[array.length - 1];

module.exports = {
  initialBlogs,
  blogsInDb,
  nonExistingId,
  usersInDb,
  last,
};
