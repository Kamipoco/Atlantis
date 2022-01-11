import { QueryInterface, Sequelize, DataTypes } from 'sequelize'

export const up = async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('user', { id: Sequelize.INTEGER });
   */
  const transaction = await queryInterface.sequelize.transaction();
  try {
    await queryInterface.addColumn('Hero', 'equippedWeaponTokenId', {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: true
    }, { transaction });

    await queryInterface.addColumn('Hero', 'equippedArmorTokenId', {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: true
    }, { transaction });

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}

export const down = async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('user');
   */
  const transaction = await queryInterface.sequelize.transaction();
  try {
    await queryInterface.removeColumn('Hero', 'equippedWeaponTokenId', { transaction });
    await queryInterface.removeColumn('Hero', 'equippedArmorTokenId', { transaction });
    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}
