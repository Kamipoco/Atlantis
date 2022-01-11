import { Router } from 'express';
import { Routes } from '@/interfaces/routes'
import IndexService from '@/services';
import MessageRoutes from './message';
import UserRoutes from './user';
import SettingRoutes from './setting';
import HeroRoutes from './hero';
import GameplayRoute from './gameplay'
import WeaponRoutes from './weapon';
import ArmorRoutes from './armor';
import MetadataRoutes from './metadata';
import GenesisHeroRoutes from './genesisHero';
import EquipmentRoutes from './equipment';
import MarketplaceRoutes from './marketplace';
import InventoryRoutes from './inventory';

class IndexRoute implements Routes {
  public path = '/';
  public router = Router();
  private indexService = new IndexService()

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, (req, res, next) => {
      try {
        res.status(200).json(this.indexService.hello());
      } catch (error) {
        next(error);
      }
    });
  }
}

const routes: Routes[] = [
  new IndexRoute(),
  new MessageRoutes(),
  new UserRoutes(),
  new SettingRoutes(),
  new GameplayRoute(),
  new HeroRoutes(),
  new WeaponRoutes(),
  new ArmorRoutes(),
  new MetadataRoutes(),
  new GenesisHeroRoutes(),
  new EquipmentRoutes(),
  new MarketplaceRoutes(),
  new InventoryRoutes(),
];

export default routes
