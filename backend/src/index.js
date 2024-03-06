const app = require('./app');
const { connectToDatabase } = require('./utils/db');
const { validateEnvVariable } = require('./utils/config');

validateEnvVariable(); // check if all required environment variables are set

const start = async () => {
  await connectToDatabase();
};

start();

const { PORT } = require('./utils/config');

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
