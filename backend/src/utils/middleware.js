const Session = require('../models/session');
const { User } = require('../models');

const errorHandler = (error, req, res, next) => {
  switch (error.name) {
    case 'SequelizeValidationError':
      return res.status(400).json({
        error:
          error.errors.len > 0
            ? error.errors.map((error) => error.message)
            : error.message,
      });
    case 'JsonWebTokenError':
      return res.status(401).json({ error: 'invalid token' });
    case 'SequelizeBaseError':
      return res.status(404).send({ error: 'resource not found' });
    default:
      return res.status(400).json({ error: error.message });
  }
  next();
};

const unknownEndpoint = (_req, res) => {
  res.status(404).json({ error: 'unknown endpoint' });
};

const sessionExtractor = async (req, res, next) => {
  const session = await Session.findByPk(req.sessionID);
  if (session) {
    req.userId = JSON.parse(session.data).userId;
    const user = await User.findByPk(req.userId);
    if (user.disabled) {
      return res.status(403).json({ error: 'user disabled - contact admin' });
    }
  } else {
    return res
      .status(403)
      .json({ error: 'invalid session - proceed to login' });
  }
  next();
};

module.exports = {
  errorHandler,
  unknownEndpoint,
  sessionExtractor,
};
