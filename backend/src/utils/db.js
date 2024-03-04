const Sequelize = require('sequelize');
require('dotenv').config();
const { DATABASE_URL } = require('./config');
const { Umzug, SequelizeStorage } = require('umzug');

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgresql',
});

const migrationConf = {
  migrations: {
    glob: 'src/migrations/*.js',
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
};

const runMigrations = async () => {
  const migrator = new Umzug(migrationConf);
  const migrations = await migrator.up();
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  });
};

const rollbackMigration = async () => {
  await sequelize.authenticate();
  const migrator = new Umzug(migrationConf);
  await migrator.down();
};

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    if (!process.env.NODE_ENV == 'test') {
      await runMigrations();
    }
    console.log('database connected');
  } catch (err) {
    console.log('connecting database failed');
    return process.exit(1);
  }

  return null;
};

module.exports = { connectToDatabase, sequelize, rollbackMigration };
