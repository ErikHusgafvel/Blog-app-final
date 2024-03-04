const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('blogs', 'year', {
      type: DataTypes.INTEGER,
      defaultValue: new Date().getFullYear(),
      validate: {
        min: { args: 1991, msg: 'Year must be greater than or equal to 1991' },
        max: {
          args: new Date().getFullYear(),
          msg: 'Year must be smaller than or equal to current year',
        },
      },
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('blogs', 'year');
  },
};
