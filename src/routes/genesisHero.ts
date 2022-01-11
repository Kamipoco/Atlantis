import { HeroMetaDataDto } from "@/dtos/metadata";
import { Routes } from "@/interfaces/routes";
import GenesisHeroService from "@/services/genesisHero";
import { routeWrapper } from "@/utils/routeWrapper";
import { Router } from "express";

export default class GenesisHeroRoutes implements Routes {
  public path = "/genHero";
  public router = Router();
  private genesisHeroService = new GenesisHeroService();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/', routeWrapper(async (req) => {
      const heroMetadata: HeroMetaDataDto = req.body;
      const data = await this.genesisHeroService.createHero(heroMetadata);
      return { data }
    }));

    this.router.get('/', routeWrapper(async (req) => {
      const page = Number(req.query.page);
      const limit = Number(req.query.limit);

      const { heroList, total } = await this.genesisHeroService.getAllHeroes(page, limit);
      return {
        data: heroList,
        metadata: {
          page,
          limit,
          total
        }
      };
    }));

    this.router.get('/:id', routeWrapper(async (req) => {
      const id = req.params.id;
      const data = await this.genesisHeroService.getHero(id);
      return { data }
    }))
  }
}
