import { GenesisHeroInstance } from '@/interfaces/hero';
import { DataTypes } from 'sequelize'
import { sequelize } from '.'

export const GenesisHero = sequelize.define<GenesisHeroInstance>(
  'GenesisHero',
  {
    id: {
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
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
    race: {
      type: DataTypes.STRING
    },
    class: {
      type: DataTypes.ENUM('Warrior', 'Lancer', 'Mage', 'Gunner', 'Priest')
    },
    image: {
      type: DataTypes.STRING
    },
    colors: {
      type: DataTypes.JSONB
    },
    metaURL: {
      type: DataTypes.STRING
    },
    nonce: {
      type: DataTypes.UUID,
      unique: true
    },
    redeemed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
  });
