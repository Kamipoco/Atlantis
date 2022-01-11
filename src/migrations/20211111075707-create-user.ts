import { QueryInterface, Sequelize, DataTypes } from 'sequelize'

export const up = (queryInterface: QueryInterface, Sequelize: Sequelize) => {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('user', { id: Sequelize.INTEGER });
   */
  return queryInterface.createTable('User', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
      defaultValue: DataTypes.UUIDV4
    },
    username: {
      unique: true,
      type: DataTypes.STRING
    },
    password: DataTypes.STRING,
    walletAddress: {
      unique: true,
      type: DataTypes.STRING,
    },
  })
}

export const down = (queryInterface: QueryInterface, Sequelize: Sequelize) => {
  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('user');
   */
  return queryInterface.dropTable('User')
}
