import { QueryInterface, Sequelize, DataTypes } from 'sequelize'

export const up = (queryInterface: QueryInterface, Sequelize: Sequelize) => {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('user', { id: Sequelize.INTEGER });
   */
  return queryInterface.createTable('Event', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
      defaultValue: DataTypes.UUIDV4
    },
    contractType: {
      type: DataTypes.ENUM({
        values: [
          "GameContract"
        ]
      }),
    },
    contractAddress: {
      type: DataTypes.STRING
    },
    transHash: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    name: {
      type: DataTypes.ENUM({
        values: [
          "Deposit",
          "Withdraw"
        ]
      }),

    },
    param: {
      type: DataTypes.JSONB,
    },
    block: {
      type: DataTypes.INTEGER
    }
  })
}

export const down = (queryInterface: QueryInterface, Sequelize: Sequelize) => {
  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('user');
   */
  return queryInterface.dropTable('Event')
}
