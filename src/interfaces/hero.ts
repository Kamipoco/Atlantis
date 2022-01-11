import { Model, Optional } from "sequelize";

export interface HeroAttributes {
  id: string,
  walletAddress: string,
  tokenId: number,
  hp: number,
  atk: number,
  pdef: number,
  level: number,
  stars: number,
  rarity: string,
  nftType: string,
  race: string,
  class: string,
  colors: object,
  equippedWeaponTokenId?: number | null,
  equippedArmorTokenId?: number | null
  marketplaceId?: string | null
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface HeroCreationAttributes extends Optional<HeroAttributes, "id"> { }

export interface HeroInstance extends Model<HeroAttributes, HeroCreationAttributes>,
  HeroAttributes {

}


export interface GenesisHeroAttributes {
  id: string,
  hp: number,
  atk: number,
  pdef: number,
  level: number,
  stars: number,
  rarity: string,
  race: string,
  class: string,
  colors: object,
  image: string,
  metaURL: string,
  nonce?: string,
  redeemed?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GenesisHeroCreationAttributes extends Optional<GenesisHeroAttributes, "id"> { }

export interface GenesisHeroInstance extends Model<GenesisHeroAttributes, GenesisHeroCreationAttributes>,
  GenesisHeroAttributes {

}
