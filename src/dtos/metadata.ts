import { IsObject, IsString, IsNumber } from "class-validator";
export class HeroMetaDataDto {
  @IsString()
  name!: string
  @IsString()
  description!: string
  @IsString()
  image!: string
  @IsString()
  nftType!: string
  @IsObject()
  colors!: {
    trait_type: string,
    value: object
  }
  @IsObject()
  race!: {
    trait_type: string,
    value: string
  }
  @IsObject()
  class!: {
    trait_type: string,
    value: string
  }
}
export class WeaponMetaDataDto {
  @IsString()
  name!: string
  @IsString()
  description!: string
  @IsString()
  image!: string
  @IsString()
  nftType!: string
  @IsObject()
  class!: object
}
export class ArmorMetaDataDto {
  @IsString()
  name!: string
  @IsString()
  description!: string
  @IsString()
  image!: string
  @IsString()
  nftType!: string
  @IsObject()
  class!: object
}

export class MintDto {
  @IsString()
  contractAddress!: string
  @IsNumber()
  tokenId!: number
  @IsString()
  metadataURL!: string
}

export class VoucherDto {
  @IsString()
  id!: string
  @IsString()
  walletAddress!: string
}
