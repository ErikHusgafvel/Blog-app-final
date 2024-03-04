const router = require('express').Router();
const { Op } = require('sequelize');

const { ValidationError } = require('sequelize');
const { Blog } = require('../models');
const User = require('../models/user');

const { sessionExtractor } = require('../utils/middleware');

const blogFinder = async (req, _res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  if (!req.blog) throw new Error('blog not found');
  next();
};

router.get('/', async (req, res) => {
  let where = {};

  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: `%${req.query.search}%`,
          },
        },
        {
          author: {
            [Op.iLike]: `%${req.query.search}%`,
          },
        },
      ],
    };
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
    where,
    order: [['likes', 'DESC']],
  });
  res.json(blogs);
});

router.post('/', sessionExtractor, async (req, res) => {
  const user = await User.findByPk(req.userId);
  const blog = await Blog.create({ ...req.body, userId: user.id });
  res.status(201).json(blog);
});

router.put('/:id', sessionExtractor, blogFinder, async (req, res) => {
  if (req.userId !== req.blog.userId) {
    return res.status(401).json({ error: 'unauthorized action' });
  }
  if (typeof req.body.likes !== 'undefined' && req.body.likes >= 0) {
    req.blog.likes = req.body.likes;
    await req.blog.save();
    res.status(200).json(req.blog);
  } else {
    throw new ValidationError('likes must be a non-negative value');
  }
});

router.delete('/:id', sessionExtractor, blogFinder, async (req, res) => {
  const user = await User.findByPk(req.userId);
  if (user.id === req.blog.userId) {
    await req.blog.destroy();
    return res.status(204).end();
  } else {
    return res.status(401).json({ error: 'unauthorized action' });
  }
});

module.exports = router;
