
import { WeaponInstance } from '@/interfaces/weapon';
import { DataTypes } from 'sequelize'
import { sequelize } from '.'
import { Marketplace } from './marketplace';
import { User } from './user';

export const Weapon = sequelize.define<WeaponInstance>(
  'Weapon',
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
    },
    equippedHeroTokenId: {
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

User.hasMany(Weapon, { foreignKey: 'walletAddress', sourceKey: 'walletAddress' });
Weapon.belongsTo(Marketplace, { foreignKey: 'marketplaceId' });
