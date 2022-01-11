import { QueryInterface, Sequelize, DataTypes } from 'sequelize'


export const up = (queryInterface: QueryInterface, Sequelize: Sequelize) => {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('user', { id: Sequelize.INTEGER });
   */
  return queryInterface.createTable('Mint', {
    id: {
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      type: DataTypes.UUID,
      unique: true
    },
    contractAddress: {
      type: DataTypes.STRING
    },
    tokenId: {
      type: DataTypes.INTEGER
    },
    metadataURL: {
      type: DataTypes.STRING
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
  return queryInterface.dropTable('Mint')
}
