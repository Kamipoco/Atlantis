import { MintInstance } from '@/interfaces/mint';
import { DataTypes } from 'sequelize'
import { sequelize } from '.'

export const Mint = sequelize.define<MintInstance>(
  'Mint',
  {
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
  },
  {
    freezeTableName: true,
    timestamps: false,
  }); 