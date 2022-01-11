import { HeroMetadataBody, WeaponMetadataBody, ArmorMetadataBody } from "@/interfaces/metadata";
import { Routes } from "@/interfaces/routes";
import GenesisMetadataService from "@/services/genesisMeta";
import { routeWrapper } from "@/utils/routeWrapper";
import { Router } from "express";
import passport from "passport";
import contract from "@/config/contracts/contracts";


export default class MetadataRoutes implements Routes {
  public path = "/meta";
  public router = Router();
  private genesisMetaService = new GenesisMetadataService();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      '/heroMetadataURL', 
      passport.authenticate('local', { session: false }), 
      routeWrapper(async (req) => {

        const heroData: HeroMetadataBody = req.body;
        const contractAddress = contract.heros.address;
        const tokenId = heroData.infoTrans.tokenId;

        const data = await this.genesisMetaService.checkMintHero( heroData, tokenId, contractAddress);

        return { data }
    }));

    this.router.post(
    '/weaponMetadataURL', 
    passport.authenticate('local', {session: false}), 
    routeWrapper(async (req) => {

        const weaponData: WeaponMetadataBody = req.body;
        const contractAddress = contract.weapons.address;
        const tokenId = weaponData.infoTrans.tokenId;

        const data = await this.genesisMetaService.checkMintWeapon( weaponData, tokenId, contractAddress);

        return { data }
    }));

    this.router.post(
      '/armorMetadataURL', 
      passport.authenticate('local', {session: false}), 
      routeWrapper(async (req) => {

        const armorData: ArmorMetadataBody = req.body;
        const contractAddress = contract.armors.address;
        const tokenId = armorData.infoTrans.tokenId;

        const data = await this.genesisMetaService.checkMintArmor( armorData, tokenId, contractAddress);

        return { data }
    }));

  }
}
