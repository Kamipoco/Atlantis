import { ItemType } from "@/constants/items";
import { HeroMetaDataDto, WeaponMetaDataDto, ArmorMetaDataDto } from "@/dtos/metadata";
import { HttpException } from "@/exceptions/HttpException";
import { ItemsMetaData } from "@/interfaces/metadata";
import { logger } from "@/utils/logger";
import { pinata } from "@/utils/pinata";
import { Mint } from "@/models/mint";
import { messageSetTokenURI, signMessage } from "@/utils/txMessage";

export default class GenesisMetadataService {
  public async genesisHeroMeta(data: HeroMetaDataDto) {
    const metaData: ItemsMetaData = {
      name: data.name,
      description: data.description,
      image: await this.pinHashToIPFS(data.image),
      nftType: ItemType.HERO,
      attributes: [
        {
          "trait_type": "hp",
          "value": parseFloat((Math.random() * 10 - 5).toFixed(1))
        },
        {
          "trait_type": "atk",
          "value": parseFloat((Math.random() * 10 - 5).toFixed(1))
        },
        {
          "trait_type": "pdef",
          "value": parseFloat((Math.random() * 10 - 5).toFixed(1))
        },
        {
          "trait_type": "rarity",
          "value": this.percentageRandom([{ "SR": 100 }, { "SSR": 5 }])
        },
        {
          "trait_type": "stars",
          "value": 1
        },
        {
          "trait_type": "level",
          "value": 1
        },
        data.class,
        data.race,
        data.colors
      ]

    }
    const metaDataURI = await this.pinMetadataToIPFS(metaData);
    return metaDataURI;
  }

  public async genesisWeaponMeta(data: WeaponMetaDataDto) {
    const metaData: ItemsMetaData = {
      name: data.name,
      description: data.description,
      image: await this.pinHashToIPFS(data.image),
      nftType: ItemType.WEAPON,
      attributes: [
        {
          "trait_type": "atk",
          "value": parseFloat((Math.random() * 10 - 5).toFixed(1))
        },
        {
          "trait_type": "perk",
          "value": Math.floor(Math.random() * 20 + 1)
        },
        {
          "trait_type": "rarity",
          "value": this.percentageRandom([{ "SR": 100 }, { "SSR": 5 }])
        },
        {
          "trait_type": "stars",
          "value": 1
        },
        {
          "trait_type": "level",
          "value": 1
        },
        data.class
      ]

    }
    const metaDataURI = await this.pinMetadataToIPFS(metaData);
    return metaDataURI;
  }

  public async genesisArmorMeta(data: ArmorMetaDataDto) {
    const metaData: ItemsMetaData = {
      name: data.name,
      description: data.description,
      image: await this.pinHashToIPFS(data.image),
      nftType: ItemType.ARMOR,
      attributes: [
        {
          "trait_type": "hp",
          "value": parseFloat((Math.random() * 10 - 5).toFixed(1))
        },
        {
          "trait_type": "perk",
          "value": Math.floor(Math.random() * 20 + 1)
        },
        {
          "trait_type": "rarity",
          "value": this.percentageRandom([{ "SR": 100 }, { "SSR": 5 }])
        },
        {
          "trait_type": "stars",
          "value": 1
        },
        {
          "trait_type": "level",
          "value": 1
        },
        data.class
      ]

    }
    const metaDataURI = await this.pinMetadataToIPFS(metaData);
    return metaDataURI;
  }

  private percentageRandom(value: Array<{ [key: string]: number }>): string {
    const randPercent: number = parseFloat((Math.random() * 100).toFixed(1))
    let returnValue = Object.keys(value)[0];
    value.forEach((item) => {
      if (randPercent - Object.values(item)[0] <= 0) {
        returnValue = Object.keys(item)[0];
      }
    });
    return returnValue;

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

  public async checkMintHero(data: any, tokenId: number, contractAddress: string): Promise<any> { 
    if (!tokenId) {
      throw new HttpException(400, 'tokenId is required');
    }

    const check = await Mint.findOne({ where: { 
      tokenId: tokenId,
      contractAddress: contractAddress
     } });

     if(!check) {
      const url = await this.genesisHeroMeta(data.metadata);
      const sig = await this.getSignature(url, data.infoTrans);
        
        const saveData = await Mint.create({
          contractAddress: contractAddress,
          tokenId: tokenId,
          metadataURL: url
        });

        saveData.save();

        return { url, sig };
     } else {
          const url = check.metadataURL;
          const sig = await this.getSignature(url, data.infoTrans);

          return { url, sig };
     }
  }

  public async checkMintWeapon(data: any, tokenId: number, contractAddress: string): Promise<any> { 
    if (!tokenId) {
      throw new HttpException(400, 'tokenId is required');
    }

    const check = await Mint.findOne({ where: { 
      tokenId: tokenId,
      contractAddress: contractAddress
     } });

     if(!check) {
      const url = await this.genesisWeaponMeta(data.metadata);
      const sig = await this.getSignature(url, data.infoTrans);
        
        const saveData = await Mint.create({
          contractAddress: contractAddress,
          tokenId: tokenId,
          metadataURL: url
        });

        saveData.save();

        return { url, sig };
     } else {
          const url = check.metadataURL;
          const sig = await this.getSignature(url, data.infoTrans);

          return { url, sig };
     }
  }
  
  public async checkMintArmor(data: any, tokenId: number, contractAddress: string): Promise<any> { 
    if (!tokenId) {
      throw new HttpException(400, 'tokenId is required');
    }

    const check = await Mint.findOne({ where: { 
      tokenId: tokenId,
      contractAddress: contractAddress
     } });

     if(!check) {
      const url = await this.genesisArmorMeta(data.metadata);
      const sig = await this.getSignature(url, data.infoTrans);
        
        const saveData = await Mint.create({
          contractAddress: contractAddress,
          tokenId: tokenId,
          metadataURL: url
        });

        saveData.save();

        return { url, sig };
     } else {
          const url = check.metadataURL;
          const sig = await this.getSignature(url, data.infoTrans);

          return { url, sig };
     }
  }

  public async getSignature(URL: string, infoTrans: any): Promise<string> { 
    const message = messageSetTokenURI(infoTrans, URL);
    const signature = await signMessage(message);

     return signature;
  }

}
