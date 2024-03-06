require('dotenv').config();

const validateEnvVariable = () => {
  const requiredEnv = ['DATABASE_URL', 'SECRET', 'SESSION_SECRET'];
  let allEnvSet = true;

  requiredEnv.forEach((envVar) => {
    if (!process.env[envVar]) {
      console.error(`Environment variable ${envVar} not set`);
      allEnvSet = false;
    }
  });

  if (!allEnvSet) {
    console.error('Exiting due to missing environment variables');
    process.exit(1);
  }
};

module.exports = {
  validateEnvVariable,
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT || 3001,
};
