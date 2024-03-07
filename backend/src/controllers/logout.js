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
    try {
      await session.destroy();
    } catch (error) {
      console.error('Error destroying session:', error);
    }
  };

  /*
  Session shoult not be null because sessionExtractor
  has made sure that at least one session with
  the userId exists in the database
  (otherwise throwing invalid session error)
  */

  try {
    await Promise.all(sessions.map(destroySessionsAsync));

    req.session.destroy((error) => {
      if (error) {
        console.error('Error destroying req.session:', error);
        res.status(500).json({ error: 'Failed to destroy session' });
      } else {
        res.status(200).end();
      }
    });
  } catch (error) {
    console.error('Error destroying sessions:', error);
    res.status(500).json({ error: 'Failed to destroy sessions' });
  }
});

module.exports = router;
