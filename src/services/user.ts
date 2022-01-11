import { UserCreateDto, UserFindDto, UserSignDto } from "@/dtos/user";
import { HttpException } from "@/exceptions/HttpException";
import { User } from "@/models/user";
import { isEmpty } from "lodash";
import { hashPassword } from "./hash";
import jwt from "jsonwebtoken";
import { UserInstance } from "@/interfaces/user";
import { gameSettings } from "@/config/gameSettings";
import { Balance } from "@/models/balance";
import { sequelize } from "@/models";
import { BigNumber } from "ethers";

export default class UserService {

  public async createUser(userData: UserCreateDto) {
    if (isEmpty(userData)) {
      throw new HttpException(400, "Not enough data");
    }

    const foundUserByUsername = await User.findOne({ where: { username: userData.username } });
    if (!isEmpty(foundUserByUsername)) {
      throw new HttpException(409, "Username has existed");
    }

    const foundUser = await User.findOne({ where: { walletAddress: userData.walletAddress } });
    if (isEmpty(foundUser)) {
      throw new HttpException(409, "Account not existed");
    }
    const trans = await sequelize.transaction();
    try {
      await foundUser?.update({
        username: userData.username,
        password: userData.password,
      }, { transaction: trans });
      await foundUser?.save();
      const userIdExistedInCoin = await Balance.findOne({ where: { userId: foundUser?.getDataValue("id") } });
      if (isEmpty(userIdExistedInCoin)) {
        await foundUser?.createBalance({ olym: BigNumber.from(0), olyc: BigNumber.from(0), soul: 0 }, { transaction: trans });
      }
      await trans.commit();
    } catch (error) {
      await trans.rollback();
      throw new HttpException(409, "Create user failed");
    }

    return foundUser;
  }

  public async findUserbyUserData(userData: UserFindDto): Promise<UserSignDto> {
    const foundUser = await User.findOne({ where: { username: userData.username, password: hashPassword(userData.password) } });
    if (isEmpty(foundUser)) {
      throw new HttpException(409, "User not exits");
    }
    const body: UserSignDto = {
      walletAddress: foundUser?.getDataValue("walletAddress") as string,
      username: foundUser?.getDataValue("username") as string
    }
    return body;
  }

  public makeJWT(body: UserSignDto): string {
    const jwtUser = jwt.sign({ user: body }, process.env.SECRET_KEY as jwt.Secret);
    return jwtUser
  }

  public async getLastStaminaInSecond(user: UserInstance): Promise<number> {
    if (!user) {
      throw new HttpException(400, 'No user specified');
    }

    const foundUser = await User.findOne({ where: { id: user.id } });

    if (!foundUser) {
      throw new HttpException(404, 'User not found');
    }

    let lastStaminaInSecond = foundUser.getDataValue('lastStaminaInSecond');

    if (!lastStaminaInSecond) {
      lastStaminaInSecond = Math.floor(Date.now() / 1000) - gameSettings.maxStamina * gameSettings.staminaInSecond;
      await foundUser.update({ lastStaminaInSecond });
      await foundUser.save();
    }

    return lastStaminaInSecond;
  }

}
