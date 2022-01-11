import { QueryInterface, Sequelize, DataTypes } from 'sequelize'

export const up = (queryInterface: QueryInterface, Sequelize: Sequelize) => {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('user', { id: Sequelize.INTEGER });
   */
  return queryInterface.addColumn('Marketplace', 'itemId', {
    type: DataTypes.INTEGER,
    unique: true
  });
}

export const down = (queryInterface: QueryInterface, Sequelize: Sequelize) => {
  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('user');
   */
  return queryInterface.removeColumn('Marketplace', 'itemId');
}
