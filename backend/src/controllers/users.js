const bcrypt = require('bcrypt');
require('dotenv').config();
const router = require('express').Router();
const { User, Blog } = require('../models');
const { ValidationError, Error } = require('sequelize');
const { sessionExtractor } = require('../utils/middleware');

router.get('/:id', async (req, res) => {
  let where = {};

  if (typeof req.query.read !== 'undefined') {
    if (!(req.query.read === 'true' || req.query.read === 'false')) {
      return res.status(400).json({ error: "bad user input for value 'read'" });
    }
    where = {
      read: req.query.read,
    };
  }

  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['id', 'passwordHash', 'createdAt', 'updatedAt'] },
    include: {
      model: Blog,
      as: 'markedBlogs',
      attributes: { exclude: ['createdAt', 'updatedAt', 'userId'] },
      through: {
        attributes: ['id', 'read'],
        where,
      },
    },
  });

  if (user) {
    res.status(201).json(user);
  } else {
    res.status(404).json({ error: 'user with given id not found' });
  }
});

router.get('/', async (_req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['passwordHash'] },
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] },
    },
  });
  res.json(users);
});

router.post('/', async (req, res) => {
  /** Password validation */
  if (!req.body.password) {
    throw new ValidationError('password required');
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(req.body.password, saltRounds);

  const user = await User.create({ ...req.body, passwordHash });
  res.status(201).json(user);
});

router.put('/:username', sessionExtractor, async (req, res) => {
  const user = await User.findOne({
    attributes: { exclude: ['passwordHash', 'createdAt', 'updatedAt'] },
    where: {
      username: req.params.username,
    },
  });
  if (user.id !== req.userId) {
    return res.status(401).json({ error: 'unauthorized action' });
  }
  if (!user) throw new Error('user not found');
  if (req.body.name) {
    user.name = req.body.name;
    await user.save();
    res.status(200).json(user);
  } else {
    throw new ValidationError('name missing a value!');
  }
});

module.exports = router;
