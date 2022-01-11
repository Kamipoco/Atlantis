import {
  HasOneCreateAssociationMixin,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  Model,
  Optional,
} from "sequelize";
import { BalanceInstance } from "./balance";
export interface UserAttributes {
  id: number,
  username?: string,
  password?: string,
  walletAddress: string,
  nonce: number,
  lastStaminaInSecond?: number
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserCreationAttributes extends Optional<UserAttributes, "id"> { }

export interface UserInstance extends Model<UserAttributes, UserCreationAttributes>,
  UserAttributes {
  getBalance: HasOneGetAssociationMixin<BalanceInstance>,
  setBalance: HasOneSetAssociationMixin<BalanceInstance, number>
  createBalance: HasOneCreateAssociationMixin<BalanceInstance>
}
