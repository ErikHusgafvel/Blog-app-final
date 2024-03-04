const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../utils/db');

class Session extends Model {}

Session.init(
  {
    sid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    expires: {
      type: DataTypes.DATE,
    },
    data: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    underscored: false,
    timestamps: true,
    modelName: 'session',
  }
);

module.exports = Session;
