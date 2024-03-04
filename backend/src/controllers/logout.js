const router = require('express').Router();

const { sessionExtractor } = require('../utils/middleware');
const Session = require('../models/session');
const { Op } = require('sequelize');

router.delete('/', sessionExtractor, async (req, res) => {
  const sessions = await Session.findAll({
    where: {
      data: {
        [Op.substring]: JSON.stringify({
          userId: req.userId,
        }).slice(1, -1), // remove surrounding brackets from the result of JSON.stringify
      },
    },
  });

  const destroySessionsAsync = async (session) => {
    await session.destroy();
  };

  /*
  Session shoult not be null because sessionExtractor
  has made sure that at least one session with
  the userId exists in the database
  (otherwise throwing invalid session error)
  */
  sessions.forEach((session) => destroySessionsAsync(session));
  req.session.destroy((error) => console.log(console.log(error)));
  res.status(200).end();
});

module.exports = router;
