import { Model, Optional } from "sequelize";
import { BigNumber } from 'ethers'

export interface BalanceAttributes {
  id: number,
  olym: BigNumber,
  olyc: BigNumber,
  soul: number,
  userId?: number
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BalanceCreationAttributes extends Optional<BalanceAttributes, "id"> { }

export interface BalanceInstance extends Model<BalanceAttributes, BalanceCreationAttributes>,
  BalanceAttributes {

}
