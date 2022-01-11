import BIGNUMBER from '@/dataTypes/BigNumber';
import { BalanceInstance } from '@/interfaces/balance';
import { BigNumber } from 'ethers';
import { DataTypes } from 'sequelize';
import { sequelize } from '.'
import { User } from './user';

export const Balance = sequelize.define<BalanceInstance>(
  'Balance',
  {
    id: {
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      type: DataTypes.UUID,
      unique: true
    },
    olym: {
      type: BIGNUMBER,
      defaultValue: BigNumber.from(0)
    },
    olyc: {
      type: BIGNUMBER,
      defaultValue: BigNumber.from(0)
    },
    soul: {
      type: DataTypes.INTEGER
    },
    userId: {
      type: DataTypes.UUIDV4,
      unique: true,
      references: {
        model: User,
        key: 'userId'
      }
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);
