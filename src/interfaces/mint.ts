import { Model, Optional } from "sequelize";

export interface MintAttributes {
  id: string,
  contractAddress: string,
  tokenId: number,
  metadataURL: string,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MintCreationAttributes extends Optional<MintAttributes, "id"> { }

export interface MintInstance extends Model<MintAttributes, MintCreationAttributes>,
  MintAttributes {

}
