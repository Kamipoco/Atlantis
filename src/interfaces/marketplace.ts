import { Model, Optional } from "sequelize";

export interface MarketplaceAttributes {
  id: string,
  price: string,
  itemId: number
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MarketplaceCreationAttributes extends Optional<MarketplaceAttributes, "id"> { }

export interface MarketplaceInstance extends Model<MarketplaceAttributes, MarketplaceCreationAttributes>,
  MarketplaceAttributes {

}
