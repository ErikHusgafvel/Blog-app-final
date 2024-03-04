const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../utils/db');

class Blog extends Model {}

Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    year: {
      type: DataTypes.INTEGER,
      defaultValue: new Date().getFullYear(),
      validate: {
        min: { args: 1991, msg: 'Year must be greater than or equal to 1991' },
        max: {
          args: new Date().getFullYear(),
          msg: 'Year must be smaller than or equal to current year',
        },
      },
    },
  },
  {
    sequelize,
    underscored: true,
    modelName: 'blog',
  }
);

module.exports = Blog;
