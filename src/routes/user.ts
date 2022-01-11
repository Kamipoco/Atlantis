import { UserCreateDto, UserFindDto } from "@/dtos/user";
import { Routes } from "@/interfaces/routes";
import { UserInstance } from "@/interfaces/user";
import BalanceService from "@/services/balance";
import UserService from "@/services/user";
import { Router } from "express";
import passport from "passport";
import { routeWrapper } from '@/utils/routeWrapper'

export default class UserRoutes implements Routes {
  public path = '/user';
  public router: Router = Router();

  private UserService = new UserService();
  private BalanceService = new BalanceService();

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.post(
      '/generateAccount',
      passport.authenticate('local', { session: false }),
      routeWrapper(async (req) => {
        const userData: UserCreateDto = req.body;
        const data = await this.UserService.createUser(userData);
        return { data }
      }));

    this.router.post(
      '/login',
      routeWrapper(async (req) => {
        const userData: UserFindDto = req.body;
        const userSignInfo = await this.UserService.findUserbyUserData(userData);
        const data = this.UserService.makeJWT(userSignInfo);
        return { data }
      }));

    this.router.get(
      '/stamina',
      passport.authenticate('local', { session: false }),
      routeWrapper(async (req) => {
        const data: number = await this.UserService.getLastStaminaInSecond(req.user as UserInstance);

        return { data }
      }));

    this.router.get(
      '/balance',
      passport.authenticate('local', { session: false }),
      routeWrapper(async (req) => {
        const user = req.user as UserInstance;
        const data = await this.BalanceService.getBalance(user);
        return { data }
      })
    )
  }
}
