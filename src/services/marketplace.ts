import { HttpException } from "@/exceptions/HttpException";
import { GenesisHero } from "@/models/genesisHero";
import { signTypeData } from "@/utils/txMessage";
import { ethers } from "ethers";
import contract from "@/config/contracts/contracts";
import { HeroInstance } from "@/interfaces/hero";
import _ from "lodash";
import { Hero } from "@/models/hero";
import { WeaponInstance } from "@/interfaces/weapon";
import { Weapon } from "@/models/weapon";
import { ArmorInstance } from "@/interfaces/armor";
import { Armor } from "@/models/armor";
import { Op } from 'sequelize';
import { Marketplace } from "@/models/marketplace";
import { WebInventoryQueryParamsDto } from "@/dtos/inventory";
import { WebInventoryQueryOptions } from "@/interfaces/inventory";
import { validateWebInventoryQueryParams } from "@/utils/validateInventoryQueryParams";
import NonceService from "@/services/nonce";
import { VoucherDto } from "@/dtos/metadata";

export default class MarketplaceService {
  private nonceService = new NonceService();

  public async genesisVoucher(queryParams: VoucherDto) {
    if (!(queryParams.id || queryParams.walletAddress)) {
      throw new HttpException(400, 'id|walletAddress is required');
    }

    const foundHero = await GenesisHero.findOne({ where: { id: queryParams.id } });

    if (!foundHero) {
      throw new HttpException(404, 'Hero not found');
    }
    const uri = foundHero.getDataValue("metaURL");
    const minPrice = ethers.utils.parseEther("25");
    const nonce = this.nonceService.getNonce();
    const voucher = {
      redeemer: queryParams.walletAddress,
      nonce,
      uri,
      minPrice
    }
    const types = {
      HeroVoucher: [
        { name: "redeemer", type: "address" },
        { name: "nonce", type: "string" },
        { name: "minPrice", type: "uint256" },
        { name: "uri", type: "string" },
      ],
    };
    const domain = {
      name: process.env.SIGNING_DOMAIN_HERO_NAME,
      version: process.env.SIGNING_DOMAIN_HERO_VERSION,
      verifyingContract: contract.heros.address,
      chainId: process.env.CHAIN_ID,
    }
    const signature = await signTypeData(domain, types, voucher);
    if (!signature) {
      throw new HttpException(409, "Cannot generate voucher");
    }
    await foundHero.update({
      nonce: nonce
    });
    const updateStatus = await foundHero.save();
    if (!updateStatus) {
      throw new HttpException(409, "Update data faild");
    }
    return {
      ...voucher,
      minPrice: minPrice.toString(),
      signature
    }
  }

  public async getHeroes(queryParams: WebInventoryQueryParamsDto): Promise<{ heroList: HeroInstance[], total: number }> {
    validateWebInventoryQueryParams(queryParams);

    const queryOptions: WebInventoryQueryOptions = {
      limit: queryParams.limit,
      offset: (queryParams.page - 1) * queryParams.limit,
      where: {}
    };

    if (queryParams.class) queryOptions.where!.class = queryParams.class;
    if (queryParams.race) queryOptions.where!.race = queryParams.race;
    if (queryParams.rarity) queryOptions.where!.rarity = queryParams.rarity;
    if (queryParams.level) queryOptions.where!.level = queryParams.level;
    if (queryParams.stars) queryOptions.where!.stars = queryParams.stars;

    if (Object.keys(queryOptions.where!).length === 0) delete queryOptions.where;

    const result = await Hero.findAndCountAll({
      ...queryOptions,
      include: { model: Marketplace }
    });

    return { heroList: result.rows, total: result.count };
  }

  public async getWeapons(queryParams: WebInventoryQueryParamsDto): Promise<{ weaponList: WeaponInstance[], total: number }> {
    validateWebInventoryQueryParams(queryParams);

    const queryOptions: WebInventoryQueryOptions = {
      limit: queryParams.limit,
      offset: (queryParams.page - 1) * queryParams.limit,
      where: {}
    };

    if (queryParams.class) queryOptions.where!.class = queryParams.class;
    if (queryParams.rarity) queryOptions.where!.rarity = queryParams.rarity;
    if (queryParams.level) queryOptions.where!.level = queryParams.level;
    if (queryParams.stars) queryOptions.where!.stars = queryParams.stars;

    if (Object.keys(queryOptions.where!).length === 0) delete queryOptions.where;

    const result = await Weapon.findAndCountAll({
      ...queryOptions,
      include: { model: Marketplace }
    });

    return { weaponList: result.rows, total: result.count };
  }

  public async getArmors(queryParams: WebInventoryQueryParamsDto): Promise<{ armorList: ArmorInstance[], total: number }> {
    validateWebInventoryQueryParams(queryParams);

    const queryOptions: WebInventoryQueryOptions = {
      limit: queryParams.limit,
      offset: (queryParams.page - 1) * queryParams.limit,
      where: {}
    };

    if (queryParams.class) queryOptions.where!.class = queryParams.class;
    if (queryParams.rarity) queryOptions.where!.rarity = queryParams.rarity;
    if (queryParams.level) queryOptions.where!.level = queryParams.level;
    if (queryParams.stars) queryOptions.where!.stars = queryParams.stars;

    if (Object.keys(queryOptions.where!).length === 0) delete queryOptions.where;

    const result = await Armor.findAndCountAll({
      ...queryOptions,
      include: { model: Marketplace }
    });

    return { armorList: result.rows, total: result.count };
  }

  public async getHeroByTokenId(tokenId: string): Promise<HeroInstance> {
    if (!tokenId) {
      throw new HttpException(400, 'tokenId is required');
    }

    const foundHero = await Hero.findOne({ where: { tokenId, marketplaceId: { [Op.not]: null } }, include: { model: Marketplace } });

    if (!foundHero) {
      throw new HttpException(404, 'Hero not found or not listed in the marketplace');
    }

    return foundHero;
  }

  public async getWeaponByTokenId(tokenId: string): Promise<WeaponInstance> {
    if (!tokenId) {
      throw new HttpException(400, 'tokenId is required');
    }

    const foundWeapon = await Weapon.findOne({ where: { tokenId, marketplaceId: { [Op.not]: null } }, include: { model: Marketplace } });

    if (!foundWeapon) {
      throw new HttpException(404, 'Weapon not found or not listed in the marketplace');
    }

    return foundWeapon;
  }

  public async getArmorByTokenId(tokenId: string): Promise<ArmorInstance> {
    if (!tokenId) {
      throw new HttpException(400, 'tokenId is required');
    }

    const foundArmor = await Armor.findOne({ where: { tokenId, marketplaceId: { [Op.not]: null } }, include: { model: Marketplace } });

    if (!foundArmor) {
      throw new HttpException(404, 'Weapon not found or not listed in the marketplace');
    }

    return foundArmor;
  }
}
