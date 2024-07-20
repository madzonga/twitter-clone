import app from './app';
import sequelize from './config/db';
import './models';  // Ensure models are imported and initialized

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // Ensure tables are created
    console.log('Database connected and tables synchronized!');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});