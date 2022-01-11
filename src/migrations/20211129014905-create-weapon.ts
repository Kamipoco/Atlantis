import { QueryInterface, Sequelize, DataTypes } from 'sequelize'

export const up = (queryInterface: QueryInterface, Sequelize: Sequelize) => {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('user', { id: Sequelize.INTEGER });
   */
  return queryInterface.createTable('Weapon', {
    id: {
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      type: DataTypes.UUID,
      unique: true
    },
    walletAddress: {
      type: DataTypes.STRING,
      references: {
        model: {
          tableName: 'User',
        },
        key: 'walletAddress'
      }
    },
    tokenId: {
      unique: true,
      type: DataTypes.INTEGER
    },
    atk: {
      type: DataTypes.FLOAT
    },
    perk: {
      type: DataTypes.INTEGER
    },
    level: {
      type: DataTypes.INTEGER
    },
    stars: {
      type: DataTypes.INTEGER
    },
    rarity: {
      type: DataTypes.ENUM('R', 'SR', 'SSR')
    },
    nftType: {
      type: DataTypes.ENUM('HERO', 'WEAPON', 'ARMOR')
    },
    class: {
      type: DataTypes.ENUM('Warrior', 'Lancer', 'Mage', 'Gunner', 'Priest')
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
  return queryInterface.dropTable('Weapon')
}
