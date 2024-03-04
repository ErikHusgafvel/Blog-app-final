const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../utils/db');

class Readings extends Model {}

Readings.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'cascade',
    },
    blogId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'blogs', key: 'id' },
      onDelete: 'cascade',
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'readings',
  }
);

module.exports = Readings;
