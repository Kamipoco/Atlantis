import { Router } from "express";
import { Routes } from "@/interfaces/routes";
import GameplayService from "@/services/gameplay";
import { routeWrapper } from "@/utils/routeWrapper";

export default class GameplayRoute implements Routes {
  public path = '/gameplay'
  public router = Router()

  private gameplayService = new GameplayService()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.post('/battle', routeWrapper(async () => {
      const data = await this.gameplayService.StartBattle()
      return { data }
    }))
  }
}