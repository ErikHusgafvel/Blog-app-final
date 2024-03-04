const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('sessions', {
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
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.TEXT,
        defaultValue: DataTypes.NOW,
      },
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('sessions');
  },
};
