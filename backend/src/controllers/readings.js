const router = require('express').Router();
const { ValidationError } = require('sequelize');
const { Readings, User } = require('../models');
const { sessionExtractor } = require('../utils/middleware');

router.post('/', sessionExtractor, async (req, res) => {
  if (!req.body.user_id) {
    throw new ValidationError('user_id required');
  }

  if (!req.body.blog_id) {
    throw new ValidationError('blog_id required');
  }

  const user = await User.findByPk(req.userId);

  if (user.id === req.body.user_id) {
    const instanceExists = await Readings.findOne({
      where: {
        userId: req.body.user_id,
        blogId: req.body.blog_id,
      },
    });
    if (instanceExists) {
      return res.status(400).json({ error: 'instance already exists in db' });
    }

    const reading = await Readings.create({
      userId: req.body.user_id,
      blogId: req.body.blog_id,
    });
    res.status(201).json(reading);
  } else {
    return res.status(401).json({ error: 'unauthorized action' });
  }
});

router.put('/:id', sessionExtractor, async (req, res) => {
  if (typeof req.body.read === 'undefined') {
    return res.status(400).json({ error: "body missing value for 'read'" });
  }

  const reading = await Readings.findByPk(req.params.id);

  if (!reading) {
    return res.status(404).json({ error: 'resource with given id not found' });
  }

  if (req.userId === reading.userId) {
    reading.read = req.body.read;
    await reading.save();
    res.status(201).json(reading);
  } else {
    return res.status(401).json({ error: 'unauthorized action' });
  }
});

module.exports = router;
