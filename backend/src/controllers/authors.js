const router = require('express').Router();
const { Blog } = require('../models');
const { sequelize } = require('../utils/db');

router.get('/', async (_req, res) => {
  const response = await Blog.findAll({
    attributes: [
      'author',
      [sequelize.fn('COUNT', sequelize.col('title')), 'blogs'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'likes'],
    ],
    group: 'author',
    order: [['likes', 'DESC']],
  });
  res.json(response);
});

module.exports = router;
