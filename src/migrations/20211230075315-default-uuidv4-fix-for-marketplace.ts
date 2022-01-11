import { QueryInterface, Sequelize, DataTypes, Utils } from 'sequelize'

export const up = async (queryInterface: QueryInterface) => {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('user', { id: Sequelize.INTEGER });
   */

  await queryInterface.sequelize.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`)

  const sql = (tableName: string, columnName: string) => `ALTER TABLE "${tableName}" ALTER COLUMN "${columnName}" SET DEFAULT uuid_generate_v4();`

  await queryInterface.sequelize.query(sql('Marketplace', 'id'))
}

export const down = async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('user');
   */
  const sql = (tableName: string, columnName: string) => `ALTER TABLE "${tableName}" ALTER COLUMN "${columnName}" DROP DEFAULT;`

  await queryInterface.sequelize.query(sql('Marketplace', 'id'))
}
