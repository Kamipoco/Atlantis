import { QueryInterface, Sequelize, DataTypes, literal } from 'sequelize'

export const up = (queryInterface: QueryInterface, Sequelize: Sequelize) => {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('user', { id: Sequelize.INTEGER });
   */
  return queryInterface.createTable('GenesisHero', {
    id: {
      primaryKey: true,
      defaultValue: literal('uuid_generate_v4()'),
      allowNull: false,
      type: DataTypes.UUID,
      unique: true
    },
    hp: {
      type: DataTypes.FLOAT
    },
    atk: {
      type: DataTypes.FLOAT
    },
    pdef: {
      type: DataTypes.FLOAT
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
    class: {
      type: DataTypes.ENUM('Warrior', 'Lancer', 'Mage', 'Gunner', 'Priest')
    },
    race: {
      type: DataTypes.STRING
    },
    image: {
      type: DataTypes.STRING
    },
    colors: {
      type: DataTypes.JSONB
    },
    metaURL: {
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
  return queryInterface.dropTable('GenesisHero')
}
