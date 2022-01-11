import 'dotenv/config';
import { DatabaseConfig } from '@/interfaces/databases'

export const development: DatabaseConfig = {
  "username": "postgres",
  "password": 'Vanlam@020499',
  "database": "atlantis",
  "host": "localhost",
  "dialect": "postgres",
}

export const testing: DatabaseConfig = {
  "username": process.env.DB_USER,
  "password": process.env.DB_PASS,
  "database": process.env.DB_NAME,
  "host": process.env.DB_HOST,
  "dialect": "postgres",
  "dialectOptions": {
    "ssl": false,
  },
}

export const production: DatabaseConfig = {
  "username": process.env.DB_USER,
  "password": process.env.DB_PASS,
  "database": process.env.DB_NAME,
  "host": process.env.DB_HOST,
  "dialect": "postgres",
  "dialectOptions": {
    "ssl": {
      "require": true,
      "rejectUnauthorized": false
    },
  },
}

export default {
  development,
  production,
  testing,
}
