import { ContractType, EventName } from '@/constants/eventname'
import { QueryInterface, Sequelize, DataTypes, Utils } from 'sequelize'

export const up = async (queryInterface: QueryInterface) => {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('user', { id: Sequelize.INTEGER });
   */

  console.log('Configuring database...')
  await queryInterface.sequelize.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`)

  const sql = (tableName: string, columnName: string) => `ALTER TABLE "${tableName}" ALTER COLUMN "${columnName}" SET DEFAULT uuid_generate_v4();`

  console.log('Migrating User table...')
  await queryInterface.sequelize.query(sql('User', 'id'))

  console.log('Migrating Coin table...')
  await queryInterface.sequelize.query(sql('Balance', 'id'))

  console.log('Migrating Hero table...')
  await queryInterface.sequelize.query(sql('Hero', 'id'))

  console.log('Migrating Armor table...')
  await queryInterface.sequelize.query(sql('Armor', 'id'))

  console.log('Migrating Weapon table...')
  await queryInterface.sequelize.query(sql('Weapon', 'id'))

  console.log('Migrating Event table...')
  await queryInterface.sequelize.query(sql('Event', 'id'))
}

export const down = async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('user');
   */
  const sql = (tableName: string, columnName: string) => `ALTER TABLE "${tableName}" ALTER COLUMN "${columnName}" DROP DEFAULT;`

  console.log('Undo migration on User table...')
  await queryInterface.sequelize.query(sql('User', 'id'))

  console.log('Undo migration on Coin table...')
  await queryInterface.sequelize.query(sql('Balance', 'id'))

  console.log('Undo migration on Hero table...')
  await queryInterface.sequelize.query(sql('Hero', 'id'))

  console.log('Undo migration on Armor table...')
  await queryInterface.sequelize.query(sql('Armor', 'id'))

  console.log('Undo migration on Weapon table...')
  await queryInterface.sequelize.query(sql('Weapon', 'id'))

  console.log('Undo migration on Event table...')
  await queryInterface.sequelize.query(sql('Event', 'id'))

  console.log('Undo configuration...')
  await queryInterface.sequelize.query(`DROP EXTENSION IF EXISTS "uuid-ossp";`)
}
