import { HttpException } from "@/exceptions/HttpException";
import { UserInstance } from "@/interfaces/user";
import { User } from "@/models/user";
import { isEmpty, omit } from "lodash";

export default class BalanceService {
  public async getBalance(user: UserInstance) {
    if (isEmpty(user)) {
      throw new HttpException(400, "No user specified");
    }

    const foundUser = await User.findOne({ where: { id: user.id } });
    if (isEmpty(foundUser)) {
      throw new HttpException(409, "The user not found");
    }

    const balance = await foundUser?.getBalance();
    if (isEmpty(balance)) {
      throw new HttpException(409, "The user dosen't have balance");
    }
    return omit(balance?.toJSON(), ["id", "userId"]);
  }
}
