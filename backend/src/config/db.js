const { Sequelize } = require('sequelize');
const env = require('./env')

const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
  host: 'localhost',   
  dialect: 'mysql',   
  logging: true,  
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
}

testConnection();





module.exports = sequelize;
