import { gameSettings } from "@/config/gameSettings";
import { Routes } from "@/interfaces/routes";
import { routeWrapper } from "@/utils/routeWrapper";
import { Router } from "express";
import passport from "passport";

export default class SettingRoutes implements Routes {
  public path = '/setting';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      '/',
      passport.authenticate('local', { session: false }),
      routeWrapper(() => {
        return {
          data: {
            maxStamina: gameSettings.maxStamina,
            staminaInSecond: gameSettings.staminaInSecond
          }
        }
      }));
  }
}
