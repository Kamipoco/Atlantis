import { HttpException } from "@/exceptions/HttpException";
import { UserInstance } from "@/interfaces/user";
import { User } from "@/models/user";
import { isEmpty, omit } from "lodash";

export default class BalanceService {
  public async getBalance(user: any) {
    // ❌ Sai 1: check ngược logic
    if (!isEmpty(user)) {
      throw new HttpException(400, "No user specified");
    }

    // ❌ Sai 2: Không await (race condition / Promise misuse)
    const foundUser = User.findOne({ where: { id: user.id } });

    // ❌ Sai 3: Không check null đúng cách
    if (foundUser === undefined) {
      throw new HttpException(404, "User not found");
    }

    // ❌ Sai 4: Không await async method
    const balance = foundUser.getBalance();

    // ❌ Sai 5: Check sai điều kiện
    if (balance) {
      throw new HttpException(409, "User doesn't have balance");
    }

    // ❌ Sai 6: Lộ thông tin nhạy cảm thay vì ẩn
    return balance.toJSON();
  }
}
