require('dotenv').config()

const HOST= process.env.DB_HOST;
const USER= process.env.DB_USER;
const PASSWORD= process.env.DB_PASSWORD;
const DB= process.env.DB_NAME;

module.exports = {
    HOST,
    USER,
    PASSWORD,
    DB,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };