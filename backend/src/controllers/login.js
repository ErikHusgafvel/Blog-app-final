const bcrypt = require('bcrypt');
const router = require('express').Router();

const User = require('../models/user');

router.post('/', async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.body.username,
    },
  });

  if (!(user && (await bcrypt.compare(req.body.password, user.passwordHash)))) {
    return res.status(401).json({ error: 'invalid username or password' });
  }

  if (user.disabled) {
    return res.status(403).json({ error: 'user disabled - contact admin' });
  }

  req.session.userId = user.id;
  await req.session.save();

  res.status(200).json({
    username: user.username,
    name: user.name,
  });
});

module.exports = router;
