import { BigNumber } from "ethers";
import { DataTypes, Utils } from "sequelize";

class BIGNUMBER extends DataTypes.STRING {
  key: string;
  constructor() {
    super()
    this.key = 'BIGNUMBER'
  }

  _stringify(value: BigNumber) {
    return value.toString()
  }

  static parse(value: string) {
    return BigNumber.from(value)
  }
}

Utils.classToInvokable(BIGNUMBER)

export default BIGNUMBER