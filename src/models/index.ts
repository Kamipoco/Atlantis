import { Sequelize } from 'sequelize';

const env = process.env.NODE_ENV || 'development';
import config from '@/config/databases'

const envConfig = config[env]

const sequelize = envConfig.url
  ? new Sequelize(envConfig.url, envConfig)
  : new Sequelize(envConfig.database as string, envConfig.username as string, envConfig.password, envConfig);

export { Sequelize, sequelize };