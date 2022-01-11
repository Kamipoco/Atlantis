import { QueryInterface, Sequelize, DataTypes } from 'sequelize'

export const up = (queryInterface: QueryInterface, Sequelize: Sequelize) => {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('balance', { id: Sequelize.INTEGER });
   */
  return queryInterface.createTable('Balance', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
      defaultValue: DataTypes.UUIDV4
    },
    olym: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    olyc: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    soul: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    userId: {
      type: DataTypes.UUID,
      unique: true,
      references: {
        model: {
          tableName: 'User',
        },
        key: 'id'
      }
    }

  })
}

export const down = (queryInterface: QueryInterface, Sequelize: Sequelize) => {
  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('balance');
   */
  return queryInterface.dropTable('Balance', { cascade: true })
}
