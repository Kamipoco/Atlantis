import { ItemType } from "@/constants/items";
import { HeroMetaDataDto } from "@/dtos/metadata";
import { HttpException } from "@/exceptions/HttpException";
import { GenesisHeroInstance } from "@/interfaces/hero";
import { ItemsMetaData } from "@/interfaces/metadata";
import { GenesisHero } from "@/models/genesisHero";
import { logger } from "@/utils/logger";
import { pinata } from "@/utils/pinata";
import _ from "lodash";

interface HeroAttb {
  name: string,
  description: string,
  hp: number,
  atk: number,
  pdef: number,
  rarity: string,
  stars: number,
  level: number,
  class: object,
  race: object,
  image: string,
  colors: object,
}
export default class GenesisHeroService {


  public async createHero(heroData: HeroMetaDataDto) {
    const hp = parseFloat((Math.random() * 10 - 5).toFixed(1));
    const atk = parseFloat((Math.random() * 10 - 5).toFixed(1));
    const pdef = parseFloat((Math.random() * 10 - 5).toFixed(1));
    const rarity = "SSR";
    const stars = 1;
    const level = 1;
    const image = await this.pinHashToIPFS(heroData.image);
    const heroAttb: HeroAttb = {
      name: heroData.name,
      description: heroData.description,
      hp: hp,
      atk: atk,
      pdef: pdef,
      rarity: rarity,
      stars: stars,
      level: level,
      image: image,
      class: heroData.class,
      race: heroData.race,
      colors: heroData.colors
    }
    const metaURL = await this.genMetaHeroURL(heroAttb);
    const hero = await GenesisHero.create({
      hp: hp,
      atk: atk,
      pdef: pdef,
      rarity: rarity,
      stars: stars,
      level: level,
      class: heroData.class.value,
      race: heroData.race.value,
      image: image,
      colors: heroData.colors.value,
      metaURL: metaURL
    });
    return hero;
  }

  public async getAllHeroes(page: number, limit: number): Promise<{ heroList: GenesisHeroInstance[], total: number }> {
    if (_.isNaN(page) || page < 1) {
      throw new HttpException(400, 'page must be a number and greater than 1');
    }

    if (_.isNaN(limit) || limit < 1) {
      throw new HttpException(400, 'limit must be a number and greater than 1');
    }

    const heroList = await GenesisHero.findAll({ limit, offset: (page - 1) * limit });
    const total = await GenesisHero.count();

    return { heroList, total };
  }

  public async getHero(id: string): Promise<GenesisHeroInstance> {
    if (_.isNaN(id)) {
      throw new HttpException(400, 'id is required');
    }
    const foundHero = await GenesisHero.findOne({ where: { id } });
    if (_.isNaN(foundHero)) {
      throw new HttpException(404, 'Hero not found');
    }
    return foundHero as GenesisHeroInstance;
  }

  private async genMetaHeroURL(heroAttb: HeroAttb) {

    const metaData: ItemsMetaData = {
      name: heroAttb.name,
      description: heroAttb.description,
      image: heroAttb.image,
      nftType: ItemType.HERO,
      attributes: [
        {
          "trait_type": "hp",
          "value": heroAttb.hp
        },
        {
          "trait_type": "atk",
          "value": heroAttb.atk
        },
        {
          "trait_type": "pdef",
          "value": heroAttb.pdef
        },
        {
          "trait_type": "rarity",
          "value": heroAttb.rarity
        },
        {
          "trait_type": "stars",
          "value": heroAttb.stars
        },
        {
          "trait_type": "level",
          "value": heroAttb.level
        },
        heroAttb.class,
        heroAttb.race,
        heroAttb.colors
      ]

    }
    const metaDataURI = await this.pinMetadataToIPFS(metaData);
    return metaDataURI;
  }

  private async pinHashToIPFS(hash: string) {
    let ipfsUrl = "";
    const options = {
      pinataMetadata: {
        name: "Image",
      }
    }
    try {
      await pinata.pinByHash(hash, options);
      ipfsUrl = "https://ipfs.io/ipfs/" + hash;
    } catch (error) {
      logger.error("Pin image to IPFS", error);
      throw new HttpException(409, "Upload image failed");
    }
    return ipfsUrl;
  }

  private async pinMetadataToIPFS(body: object) {
    let ipfsUrl = "";
    const options = {
      pinataMetadata: {
        name: "Metadata",
      },
      pinataOptions: {
        cidVersion: 0 || undefined
      }
    }
    try {
      const result = await pinata.pinJSONToIPFS(body, options);
      ipfsUrl = "https://gateway.pinata.cloud/ipfs/" + result.IpfsHash;
    } catch (error) {
      logger.error("Pin metadata to IPFS", error);
      throw new HttpException(409, "Upload metadata failed");
    }
    return ipfsUrl;
  }
}
