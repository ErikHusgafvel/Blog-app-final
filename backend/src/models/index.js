const Blog = require('./blog');
const User = require('./user');
const Readings = require('./readings');

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: Readings, as: 'markedBlogs' });
Blog.belongsToMany(User, { through: Readings, as: 'usersMarked' });

module.exports = {
  Blog,
  User,
  Readings,
};
