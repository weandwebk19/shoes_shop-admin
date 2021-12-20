require('dotenv').config();
module.exports = {
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DB_DATABASE,
  dialect:process.env.DB_DIALECT,
  pool: {
    max: parseInt(process.env.DB_BOOL_MAX),
    min: parseInt(process.env.DB_BOOL_MIN),
    acquire: parseInt(process.env.DB_BOOL_ACQUIRE),
    idle: parseInt(process.env.DB_BOOL_IDLE)
  }
};