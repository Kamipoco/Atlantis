import { QueryInterface, Sequelize, DataTypes } from 'sequelize'

export const up = async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('user', { id: Sequelize.INTEGER });
   */
  const transaction = await queryInterface.sequelize.transaction()

  try {
    await queryInterface.addColumn('GenesisHero', 'nonce', {
      type: DataTypes.UUID,
      unique: true
    }, { transaction });

    await queryInterface.addColumn('GenesisHero', 'redeemed', {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }, { transaction });

    await transaction.commit();
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    throw error;
  }
}

export const down = async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('user');
   */
  const transaction = await queryInterface.sequelize.transaction()

  try {
    await queryInterface.removeColumn('GenesisHero', 'nonce', { transaction });
    await queryInterface.removeColumn('GenesisHero', 'redeemed', { transaction });
   
    await transaction.commit();
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    throw error;
  }
}
