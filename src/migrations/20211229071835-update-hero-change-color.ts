import { QueryInterface, Sequelize, DataTypes } from 'sequelize'

export const up = async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('balance', { id: Sequelize.INTEGER });
   */
  await queryInterface.removeColumn('Hero', 'colors');

  await queryInterface.addColumn('Hero', 'colors', {
    type: DataTypes.JSONB
  });
}

export const down = async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('balance');
   */
  await queryInterface.removeColumn('Hero', 'colors');

  await queryInterface.addColumn('Hero', 'colors', {
    type: DataTypes.ARRAY(DataTypes.STRING)
  });
}
