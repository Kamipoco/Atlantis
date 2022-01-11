import { HeroInstance } from '@/interfaces/hero';
import { DataTypes } from 'sequelize'
import { sequelize } from '.'
import { Marketplace } from './marketplace';
import { User } from './user';

export const Hero = sequelize.define<HeroInstance>(
  'Hero',
  {
    id: {
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      type: DataTypes.UUID,
      unique: true
    },
    walletAddress: {
      type: DataTypes.STRING,
      references: {
        model: User,
        key: 'walletAddress'
      }
    },
    tokenId: {
      unique: true,
      type: DataTypes.INTEGER
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
    nftType: {
      type: DataTypes.ENUM('HERO', 'WEAPON', 'ARMOR')
    },
    race: {
      type: DataTypes.STRING
    },
    class: {
      type: DataTypes.ENUM('Warrior', 'Lancer', 'Mage', 'Gunner', 'Priest')
    },
    colors: {
      type: DataTypes.JSONB
    },
    equippedWeaponTokenId: {
      type: DataTypes.INTEGER
    },
    equippedArmorTokenId: {
      type: DataTypes.INTEGER    
    },
    marketplaceId: {
      type: DataTypes.UUID,
      unique: true,
      references: {
        model: Marketplace,
        key: 'id'
      }
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
  });

User.hasMany(Hero, { foreignKey: 'walletAddress', sourceKey: 'walletAddress' });
Hero.belongsTo(Marketplace, { foreignKey: 'marketplaceId' });
