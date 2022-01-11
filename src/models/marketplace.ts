import { MarketplaceInstance } from '@/interfaces/marketplace';
import { DataTypes } from 'sequelize';
import { sequelize } from '.'

export const Marketplace = sequelize.define<MarketplaceInstance>(
  'Marketplace',
  {
    id: {
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      type: DataTypes.UUID,
      unique: true
    },
    price: {
      type: DataTypes.STRING
    },
    itemId: {
      type: DataTypes.INTEGER,
      unique: true
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);
