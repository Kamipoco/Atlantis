import { QueryInterface, Sequelize, DataTypes } from 'sequelize'

export const up = async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('user', { id: Sequelize.INTEGER });
   */
  return queryInterface.renameColumn('Armor', 'atk', 'hp');
}

export const down = (queryInterface: QueryInterface, Sequelize: Sequelize) => {
  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('user');
   */
  return queryInterface.renameColumn('Armor', 'hp', 'atk');
}
