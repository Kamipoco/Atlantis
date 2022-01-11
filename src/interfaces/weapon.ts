import { Model, Optional } from "sequelize";

export interface WeaponAttributes {
  id: string,
  walletAddress: string,
  tokenId: number,
  atk: number,
  perk: number,
  level: number,
  stars: number,
  rarity: string,
  nftType: string,
  class: string,
  equippedHeroTokenId?: number | null
  marketplaceId?: string | null
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface WeaponCreationAttributes extends Optional<WeaponAttributes, "id"> { }

export interface WeaponInstance extends Model<WeaponAttributes, WeaponCreationAttributes>,
  WeaponAttributes {

}
