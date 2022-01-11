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
    await queryInterface.addColumn('Hero', 'marketplaceId', {
      type: DataTypes.UUID,
      unique: true,
      allowNull: true,
      references: {
        model: {
          tableName: 'Marketplace'
        },
        key: 'id'
      }
    }, { transaction });

    await queryInterface.addColumn('Weapon', 'marketplaceId', {
      type: DataTypes.UUID,
      unique: true,
      allowNull: true,
      references: {
        model: {
          tableName: 'Marketplace'
        },
        key: 'id'
      }
    }, { transaction });

    await queryInterface.addColumn('Armor', 'marketplaceId', {
      type: DataTypes.UUID,
      unique: true,
      allowNull: true,
      references: {
        model: {
          tableName: 'Marketplace'
        },
        key: 'id'
      }
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
    await queryInterface.removeColumn('Hero', 'marketplaceId', { transaction });
    await queryInterface.removeColumn('Weapon', 'marketplaceId', { transaction });
    await queryInterface.removeColumn('Armor', 'marketplaceId', { transaction });

    await transaction.commit();
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    throw error;
  }
}
