import { HeroMetaDataDto, WeaponMetaDataDto, ArmorMetaDataDto} from "@/dtos/metadata";

export interface ItemsMetaData {
  name: string,
  description: string,
  image: string,
  nftType: string,
  attributes: Array<object>
}

export interface SetTokenURIParams {
  from: string,
  tokenId: number,
  nonce: number
}
export interface HeroMetadataBody {
  metadata: HeroMetaDataDto,
  infoTrans: SetTokenURIParams,
}
export interface WeaponMetadataBody {
  metadata: WeaponMetaDataDto,
  infoTrans: SetTokenURIParams,
}
export interface ArmorMetadataBody {
  metadata: ArmorMetaDataDto,
  infoTrans: SetTokenURIParams,
}
