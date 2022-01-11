import { UserInstance } from '@/interfaces/user';
import { hashPassword } from '@/services/hash'
import { DataTypes } from 'sequelize'
import { sequelize } from '.'
import { Balance } from './balance';

export const User = sequelize.define<UserInstance>(
  'User',
  {
    id: {
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      type: DataTypes.UUID,
      unique: true
    },
    username: {
      unique: true,
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING,
      set(password: string) {
        const digestedPassword = hashPassword(password)
        this.setDataValue('password', digestedPassword)
      }
    },
    walletAddress: {
      unique: true,
      type: DataTypes.STRING,
    },
    nonce: {
      type: DataTypes.INTEGER
    },
    lastStaminaInSecond: {
      type: DataTypes.INTEGER
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
  });

User.hasOne(Balance, { foreignKey: 'userId', sourceKey: 'id' })
